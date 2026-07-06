import { createHash } from "node:crypto"

const GITHUB_USER = "zekurio"

export const SSH_KEYS_URL = `https://github.com/${GITHUB_USER}.keys`
export const GPG_KEYS_URL = `https://github.com/${GITHUB_USER}.gpg`

export interface SshKey {
  type: string
  value: string
  fingerprint: string
}

export interface PublicKeys {
  ssh: SshKey[]
  gpg: string | null
}

// ssh-keygen-compatible fingerprint: base64(sha256(raw key blob)) without padding.
function sshFingerprint(blob: string): string {
  const digest = createHash("sha256")
    .update(Buffer.from(blob, "base64"))
    .digest("base64")
  return `SHA256:${digest.replace(/=+$/, "")}`
}

// Mirrors GitHub's raw plaintext (github.com/<user>.keys / .gpg) verbatim so
// scripts can parse the site's endpoints exactly like GitHub's.
export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return res.text()
}

// Parsed keys for the human-facing page. Runs at build time.
export async function getPublicKeys(): Promise<PublicKeys> {
  const [sshRaw, gpgRaw] = await Promise.all([
    fetchText(SSH_KEYS_URL),
    fetchText(GPG_KEYS_URL),
  ])

  const ssh = sshRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [type, blob] = line.split(/\s+/)
      return { type, value: line, fingerprint: sshFingerprint(blob) }
    })

  // GitHub always returns an armored block; when empty it embeds a note.
  const gpg = gpgRaw.trim()
  const hasGpg = gpg.length > 0 && !gpg.includes("hasn't uploaded any GPG keys")

  return { ssh, gpg: hasGpg ? gpg : null }
}
