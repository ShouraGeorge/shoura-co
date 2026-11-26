import { cookieHeader, whoami } from "./_lib.js";

// GitHub sends the browser back here with a short-lived code. The code is
// swapped for an access token using the client secret, which lives in the
// Cloudflare environment and never reaches the browser.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const raw = request.headers.get("Cookie") || "";
  const expected = raw.split(";").map(s => s.trim())
    .find(s => s.startsWith("shoura_state="))?.slice("shoura_state=".length);

  if (!code || !state || !expected || state !== expected) {
    return new Response("Sign-in could not be verified. Start again from /admin.", { status: 400 });
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GH_CLIENT_ID,
      client_secret: env.GH_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    return new Response("GitHub did not return a token. Start again from /admin.", { status: 400 });
  }

  // Only the account named in GH_ALLOWED_LOGIN gets a session.
  const user = await whoami(data.access_token, env);
  if (!user) {
    return new Response("This GitHub account is not allowed to edit this site.", { status: 403 });
  }

  const headers = new Headers({ Location: "/admin/" });
  headers.append("Set-Cookie", cookieHeader(data.access_token, 60 * 60 * 8));
  headers.append("Set-Cookie", "shoura_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return new Response(null, { status: 302, headers });
}
