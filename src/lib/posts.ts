import type { MarkdownInstance } from "astro"

export interface PostFrontmatter {
  title: string
  date: string | Date
}

export type Post = MarkdownInstance<PostFrontmatter>

// Newest first.
export function getPosts() {
  const postModules = import.meta.glob<Post>("../content/posts/*.md", {
    eager: true,
  })
  return Object.values(postModules).sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  )
}

export function postSlug(post: Post) {
  return (post.file.split("/").pop() ?? "").replace(".md", "")
}
