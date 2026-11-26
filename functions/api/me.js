import { readToken, whoami, json } from "./_lib.js";

// The admin page asks this on load: is there a valid session, and whose?
export async function onRequestGet({ request, env }) {
  const token = readToken(request);
  if (!token) return json({ signedIn: false });
  const user = await whoami(token, env);
  if (!user) return json({ signedIn: false });
  return json({ signedIn: true, user, repo: env.GH_REPO });
}
