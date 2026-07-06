const GITHUB_USER = "zekurio"

export const SSH_KEYS_URL = `https://github.com/${GITHUB_USER}.keys`
export const GPG_KEYS_URL = `https://github.com/${GITHUB_USER}.gpg`

// Mirrors GitHub's raw plaintext (github.com/<user>.keys / .gpg) verbatim so
// scripts can parse the site's endpoints exactly like GitHub's.
export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return res.text()
}
