import type { MarkdownInstance } from "astro"

// PCPartPicker-style category order used for display on system pages.
export const componentCategories = [
  "cpu",
  "cooler",
  "motherboard",
  "memory",
  "storage",
  "gpu",
  "psu",
  "case",
  "network",
  "other",
] as const

export type ComponentCategory = (typeof componentCategories)[number]

export interface HomelabComponent {
  category: ComponentCategory
  name: string
  // Sub-label shown when a category has multiple entries, e.g. "flash".
  label?: string
  count?: number
  size?: string
}

export interface HomelabComponentGroup {
  category: ComponentCategory
  components: HomelabComponent[]
}

export interface HomelabFrontmatter {
  title: string
  description: string
  role?: string
  status?: string
  since?: string | Date
  location?: string
  os?: string
  components?: HomelabComponent[]
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

// Groups components into one row per category, in the fixed category order,
// keeping the authored order within each category (e.g. storage entries).
export function groupComponents(
  components: HomelabComponent[],
): HomelabComponentGroup[] {
  return componentCategories.flatMap((category) => {
    const matched = components.filter(
      (component) => component.category === category,
    )
    return matched.length > 0 ? [{ category, components: matched }] : []
  })
}

// Renders a component as e.g. "2 × 8tb hdd" or "ryzen 5 5600x".
export function formatComponent(component: HomelabComponent) {
  const parts: string[] = []
  if (component.count && component.count > 1) {
    parts.push(`${component.count} ×`)
  }
  if (component.size) {
    parts.push(component.size)
  }
  parts.push(component.name)
  return parts.join(" ")
}
