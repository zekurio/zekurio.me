import type { APIRoute } from "astro"

import { fetchText, SSH_KEYS_URL } from "../lib/keys"

// Raw plaintext mirror of github.com/zekurio.keys, byte-identical for parsing.
export const GET: APIRoute = async () => {
  const body = await fetchText(SSH_KEYS_URL)
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  })
}
