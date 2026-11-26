// Shared helpers for the admin's server side.
// These run on Cloudflare Pages Functions, where the GitHub OAuth secret and
// the allowed account live as environment variables — never in this repo.

export const COOKIE = "shoura_gh";

export function cookieHeader(value, maxAge) {
  // Path=/api keeps the token off every other request the browser makes.
  // HttpOnly means page scripts cannot read it, so an injected script on the
  // site cannot walk away with a token that can write to the repository.
  const bits = [
    `${COOKIE}=${value}`,
    "Path=/api",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  return bits.join("; ");
}

export function readToken(request) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === COOKIE) return v.join("=");
  }
  return null;
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

const UA = { "User-Agent": "shoura-co-admin", Accept: "application/vnd.github+json" };

export async function gh(path, token, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { ...UA, Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  return res;
}

// Who is signed in, and are they allowed to write here?
export async function whoami(token, env) {
  const res = await gh("/user", token);
  if (!res.ok) return null;
  const user = await res.json();
  const allowed = (env.GH_ALLOWED_LOGIN || "").toLowerCase();
  if (allowed && user.login.toLowerCase() !== allowed) return null;
  return { login: user.login, name: user.name, avatar: user.avatar_url };
}
