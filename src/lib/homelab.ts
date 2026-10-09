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
  name: string
  // Sub-label shown when a category has multiple entries, e.g. "flash".
  label?: string
  count?: number
  size?: string
}

export interface HomelabSystem {
  // Hostname; also the URL segment under /homelab.
  name: string
  description: string
  role?: string
  os?: string
  components: Partial<Record<ComponentCategory, HomelabComponent[]>>
}

export interface SpecEntry {
  label?: string
  value: string
}

export interface SpecRow {
  label: string
  entries: SpecEntry[]
}

// Listed in this order on /homelab.
export const homelabSystems: HomelabSystem[] = [
  {
    name: "adam",
    description:
      "big boi. used for storage + hosting.",
    role: "storage",
    os: "nixos 26.11 (unstable)",
    components: {
      cpu: [{ name: "ryzen 5 5600x" }],
      memory: [{ name: "ddr4", size: "32gb" }],
      storage: [
        { label: "flash", name: "samsung 870 evo", count: 2, size: "512gb" },
        {
          label: "spinning rust",
          name: "seagate ironwolf pro",
          count: 2,
          size: "8tb",
        },
      ],
      gpu: [{ name: "intel arc a380" }],
      psu: [{ name: "sfx psu" }],
      case: [{ name: "jonsbo n6" }],
    },
  },
]

// Hardware rows in the fixed category order, followed by os and role.
// Components render as e.g. "2 × 8tb seagate ironwolf pro".
export function specRows(system: HomelabSystem): SpecRow[] {
  const hardware = componentCategories.flatMap((category) => {
    const components = system.components[category] ?? []
    if (components.length === 0) {
      return []
    }
    return [
      {
        label: category,
        entries: components.map((component) => ({
          label: component.label,
          value: [
            component.count && component.count > 1
              ? `${component.count} ×`
              : "",
            component.size ?? "",
            component.name,
          ]
            .filter(Boolean)
            .join(" "),
        })),
      },
    ]
  })
  const software = (["os", "role"] as const).flatMap((field) => {
    const value = system[field]
    return value ? [{ label: field, entries: [{ value }] }] : []
  })
  return [...hardware, ...software]
}
