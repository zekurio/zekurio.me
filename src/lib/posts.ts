import type { MarkdownInstance } from "astro"

export interface PostFrontmatter {
  title: string
  date: string | Date
}

export type Post = MarkdownInstance<PostFrontmatter>

// Newest first.
export const posts = Object.values(
  import.meta.glob<Post>("../content/posts/*.md", { eager: true }),
).sort(
  (a, b) =>
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime(),
)

export function postSlug(post: Post) {
  return (post.file.split("/").pop() ?? "").replace(/\.md$/, "")
}

export function formatPostDate(post: Post, month: "short" | "long") {
  return new Date(post.frontmatter.date).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
  })
}
