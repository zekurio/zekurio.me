# AGENTS.md

Repo-specific context for AI agents working in `zekurio.me`.

- The default branch in this repo is `main`. Use `main` or `origin/main` for diffs.
- Use `pnpm` for package management and scripts.
- This is an Astro site deployed with Wrangler/Cloudflare tooling.
- Commit scopes when helpful: `blog`, `layout`, `projects`, `content`, `styles`, `astro`, `deploy`. Example: `fix(blog): correct post metadata`.

## Astro and TypeScript

- Prefer Astro pages/layouts/components for static content and islands only when client interactivity is actually needed.
- Keep content-oriented code close to `src/content` and route-oriented code close to `src/pages`.
- Use Astro's typed APIs and content collection helpers before ad-hoc filesystem or frontmatter parsing.
- Avoid `try`/`catch` where possible; use it at build, content, or deployment boundaries where failures need to be translated or recovered.
- Avoid `any`; narrow loose data with `unknown`, content schemas, or explicit local types. Rely on type inference unless annotations are needed for exports or clarity.
- Avoid unnecessary destructuring; use dot notation when it preserves context. Never alias or star-import; if a namespace-style value is needed, import the module's own exported namespace by name.

## UI, Content, and Accessibility

- Treat the first viewport as real content, not a marketing shell. The visitor should immediately understand the page or post they opened.
- Keep typography readable and stable across mobile and desktop. Text must not overflow buttons, cards, nav, or code blocks.
- Use semantic HTML and accessible labels before adding custom interaction.
- Use real images/assets when they carry meaning; avoid decorative-only complexity.
- Keep blog and project copy direct. Prefer concrete work, dates, and outcomes over generic claims.
- Do not add visible instructional text about how the UI works unless it is part of the content itself.

## Styling and Assets

- Follow existing layout and style patterns in `src/layouts` and `src/pages` before introducing new primitives.
- Keep visual changes restrained and intentional. Avoid one-note palettes and oversized decorative sections unless they serve the page.
- Use assets from `public/` when they need stable public URLs.
- Keep generated output under `dist/` out of source changes unless the task explicitly requires inspecting a build artifact.

## Testing

- For content-only changes, read the rendered Astro page or run a local preview when layout could be affected.
- For deployment or config changes, verify Wrangler/Astro commands relevant to the changed surface.

## Task Completion Requirements

All of these must pass before considering a coding task completed:

```sh
pnpm run format:check
pnpm run lint
pnpm run build
```

Use `pnpm run format` or `pnpm run lint:fix` only when you intend to modify formatting/lint output.

Deployment: run `pnpm run generate-types` when Cloudflare/Wrangler bindings change. Run `pnpm run deploy` only when explicitly requested.

Content-only tasks: verification can be limited to reading the changed files plus `pnpm run format:check` unless layout, routing, or generated pages are affected.

## Project Structure

- `src/pages` - Astro routes for home, blog, project pages, and dynamic post pages.
- `src/layouts` - shared page layouts.
- `src/content/posts` - blog post content.
- `public` - static assets served directly.
- `astro.config.mjs` - Astro site configuration.
- `wrangler.jsonc` - Cloudflare/Wrangler deployment configuration.
- `package.json` - pnpm scripts, Astro dependencies, oxfmt, oxlint, and Wrangler tooling.

## Project Snapshot

`zekurio.me` is a personal Astro site with blog and project pages, formatted with `oxfmt`, linted with `oxlint`, and deployed through Wrangler.

## Core Priorities

1. Clear public-facing content first.
2. Fast, accessible static pages first.
3. Keep layout and typography predictable across screen sizes.
4. Keep deployment configuration boring and reproducible.

If a tradeoff is required, choose readability, accessibility, and predictable static output over short-term convenience.

## Shared Conventions

<!-- Shared across repos; sync deliberate changes to the other repos' AGENTS.md. -->

### Branch Names

Use a short branch name of at most three words, separated by hyphens. Do not use slashes or type prefixes such as `feat/` or `fix/`. Examples: `session-recovery`, `fix-scroll-state`.

### Commits and PR Titles

Use conventional commit-style messages and PR titles: `type(scope): summary`.

Valid types are `feat`, `fix`, `docs`, `chore`, `refactor`, and `test`. Scopes are optional; useful scopes are listed at the top of this file.

### Style: General Principles

- Keep related logic in one function unless extracting it makes the behavior easier to reuse, test, or reason about.
- Do not extract single-use helpers preemptively. Inline the logic at the call site unless the helper is reused, hides a genuinely complex boundary, or has a clear independent name that improves the caller.
- Keep the happy path readable: handle validation, missing resources, and errors early with early returns; avoid unnecessary `else`.
- Reduce total variable count by inlining values that are only used once, but keep named intermediates when they explain business logic.
- Prefer boring, explicit code over clever abstractions.
- Keep synchronous parsing, validation, and option building synchronous. Do not introduce async control flow or concurrency unless the operation is actually asynchronous.
- Add comments for non-obvious constraints and surprising behavior, not for obvious assignments or control flow.

### Testing

- Avoid mocks as much as possible; prefer real temporary directories, in-memory fixtures, and small fake implementations.
- Test observable behavior and public contracts; do not duplicate production logic into tests.
- Run targeted checks while iterating, then run the completion checks listed above before calling a coding task done.

### Task Completion

- Coding tasks: the completion checks listed above must pass before the task is considered done.
- Nix tasks: run appropriate checks for the changed surface; issue builds only when actually warranted.
- Documentation or planning tasks: verification can be limited to reading the changed files unless the user asks for more. Still keep examples and commands accurate.

### Maintainability

Long-term maintainability is a core priority. When adding functionality, first check if there is shared logic that can be extracted to a separate module or package, or an existing module that owns it. Duplicate logic across multiple files is a code smell. Don't be afraid to change existing code; don't take shortcuts by adding isolated local logic to solve a problem.
