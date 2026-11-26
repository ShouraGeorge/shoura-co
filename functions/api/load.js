import { readToken, whoami, gh, json } from "./_lib.js";

// Reads the live content file out of the repository, so the admin always
// opens on what is actually published rather than on a stale local draft.
export async function onRequestGet({ request, env }) {
  const token = readToken(request);
  if (!token) return json({ error: "not signed in" }, 401);
  const user = await whoami(token, env);
  if (!user) return json({ error: "not allowed" }, 403);

  const res = await gh(`/repos/${env.GH_REPO}/contents/src/assets/content.js`, token);
  if (!res.ok) return json({ error: `GitHub ${res.status}` }, 502);
  const file = await res.json();
  // content comes back base64 with newlines in it
  const text = new TextDecoder().decode(
    Uint8Array.from(atob(file.content.replace(/\n/g, "")), c => c.charCodeAt(0))
  );
  return json({ text, sha: file.sha });
}
