import { readToken, whoami, gh, json } from "./_lib.js";

// Writes every changed file in ONE commit, through the Git data API, so the
// build runs once and the site never goes live with the text updated but the
// images missing. The Contents API would need a commit per file.

const MAX_FILES = 40;
const MAX_BYTES = 6 * 1024 * 1024;

// The admin may only touch content and product images. Without this, a
// session could rewrite the builder or the deploy config.
const ALLOWED = /^src\/assets\/(content\.js|products\/[A-Za-z0-9._-]+\.(webp|jpg|jpeg|png))$/;

export async function onRequestPost({ request, env }) {
  const token = readToken(request);
  if (!token) return json({ error: "not signed in" }, 401);
  const user = await whoami(token, env);
  if (!user) return json({ error: "not allowed" }, 403);

  let body;
  try { body = await request.json(); } catch { return json({ error: "bad request" }, 400); }

  const files = Array.isArray(body.files) ? body.files : [];
  if (!files.length) return json({ error: "nothing to save" }, 400);
  if (files.length > MAX_FILES) return json({ error: `too many files (max ${MAX_FILES})` }, 400);

  let total = 0;
  for (const f of files) {
    if (typeof f.path !== "string" || typeof f.content_base64 !== "string")
      return json({ error: "bad file entry" }, 400);
    if (!ALLOWED.test(f.path))
      return json({ error: `this path is not editable here: ${f.path}` }, 400);
    total += Math.floor(f.content_base64.length * 0.75);
  }
  if (total > MAX_BYTES) return json({ error: "too much data in one save" }, 413);

  const repo = env.GH_REPO;
  const branch = env.GH_BRANCH || "main";
  const step = async (path, init) => {
    const res = await gh(path, token, init);
    if (!res.ok) throw new Error(`${path} → ${res.status} ${(await res.text()).slice(0, 180)}`);
    return res.json();
  };

  try {
    const ref = await step(`/repos/${repo}/git/ref/heads/${branch}`);
    const headSha = ref.object.sha;
    const head = await step(`/repos/${repo}/git/commits/${headSha}`);

    const tree = [];
    for (const f of files) {
      const blob = await step(`/repos/${repo}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: f.content_base64, encoding: "base64" }),
      });
      tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    const newTree = await step(`/repos/${repo}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: head.tree.sha, tree }),
    });

    const message = (body.message || "Update content from the admin").slice(0, 200);
    const commit = await step(`/repos/${repo}/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha] }),
    });

    // Not forced: if something else moved the branch meanwhile, GitHub refuses
    // and the edit is reported rather than quietly overwriting that change.
    await step(`/repos/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });

    return json({ ok: true, commit: commit.sha.slice(0, 7), files: files.length });
  } catch (e) {
    return json({ error: String(e.message || e) }, 502);
  }
}
