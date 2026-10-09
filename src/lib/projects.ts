// Dot colors for the language tag on /projects.
export const langColors = {
  astro: "var(--pink)",
  c: "var(--blue)",
  cpp: "var(--purple)",
  csharp: "var(--green)",
  css: "var(--blue)",
  dart: "var(--cyan)",
  go: "var(--cyan)",
  html: "var(--orange)",
  java: "var(--red)",
  javascript: "var(--yellow)",
  kotlin: "var(--pink)",
  nix: "var(--purple)",
  php: "var(--purple)",
  python: "var(--yellow)",
  ruby: "var(--red)",
  rust: "var(--orange)",
  shell: "var(--green)",
  svelte: "var(--orange)",
  swift: "var(--orange)",
  typescript: "var(--blue)",
  vue: "var(--green)",
  zig: "var(--yellow)",
}

export interface Project {
  name: string
  description: string
  url: string
  language: keyof typeof langColors
}

// Listed in this order on /projects.
export const projects: Project[] = [
  {
    name: "alloy",
    description: "an open-source, self-hostable alternative to Medal.tv",
    url: "https://github.com/zekurio/alloy",
    language: "typescript",
  },
  {
    name: "blitzcrank",
    description: "a support bot for my homelab, built on top of Pi",
    url: "https://github.com/zekurio/blitzcrank",
    language: "typescript",
  },
  {
    name: "inviterr",
    description: "user management and invitations for Jellyfin",
    url: "https://github.com/zekurio/inviterr",
    language: "typescript",
  },
]
