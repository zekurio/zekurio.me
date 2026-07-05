import type { MarkdownInstance } from "astro"

export interface HomelabSpec {
  label: string
  value: string
  count?: number
}

export interface HomelabFrontmatter {
  title: string
  description: string
  role?: string
  status?: string
  since?: string | Date
  location?: string
  hardware?: string
  os?: string
  network?: string
  specs?: HomelabSpec[]
  tags?: string[]
}

export type HomelabSystem = MarkdownInstance<HomelabFrontmatter>

export function getHomelabSystems() {
  const systemModules = import.meta.glob<HomelabSystem>(
    "../content/homelab/*.md",
    {
      eager: true,
    },
  )
  return Object.values(systemModules).sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title),
  )
}
