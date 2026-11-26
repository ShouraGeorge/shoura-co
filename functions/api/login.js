// Sends the browser to GitHub to sign in. No secret is involved here —
// only the public client id — so this endpoint is safe to hit directly.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const to = new URL("https://github.com/login/oauth/authorize");
  to.searchParams.set("client_id", env.GH_CLIENT_ID);
  to.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  to.searchParams.set("scope", "repo");
  to.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: to.toString(),
      // The state is echoed back by GitHub; the callback checks it matches,
      // so a login cannot be started by a third-party page.
      "Set-Cookie": `shoura_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
