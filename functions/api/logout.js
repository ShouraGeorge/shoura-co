import { COOKIE } from "./_lib.js";

export async function onRequestPost() {
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": `${COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0` },
  });
}
