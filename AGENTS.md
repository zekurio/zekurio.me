# Repository Guidelines

- `zekurio.me` is a small personal Astro site: routes in `src/pages`
  (`index`, `projects`, `blog`, `blog/[slug]`, `homelab`, `homelab/[slug]`,
  plus the `zekurio.keys` and `zekurio.gpg` text endpoints),
  `src/layouts/Base.astro` as the only layout, typed helpers in `src/lib`,
  markdown in `src/content/{posts,homelab}`, static assets in `public/`.
- The default branch is `main`; use `main` or `origin/main` for diffs.
- Node 24.14.0 (`.node-version`, flake devshell) and `pnpm@10.12.1` (pinned);
  never use npm, yarn, or Bun. `pnpm dev` runs the Astro dev server;
  `pnpm preview` builds and serves through the local Workers runtime
  (`wrangler dev`).
- Formatting is oxfmt and linting is oxlint (type-aware, `no-console` is an
  error), not Prettier/ESLint. There is no test or typecheck script.
- `pnpm run format:check`, `pnpm run lint`, and `pnpm run build` must all pass
  before a coding task is complete. Use `pnpm run format` / `pnpm run lint:fix`
  only when you intend to rewrite formatting or lint output.
- oxfmt and oxlint only match `.ts`/`.mjs`/`.json`; `.astro` files are neither
  formatted nor linted, so match the style already used in the file you edit.
- Output is `static` and deployed as Cloudflare Workers static assets
  (`wrangler.jsonc` uploads `dist/` with auto-trailing-slash). There is no
  server runtime: no SSR, middleware, or request-time code. Run
  `pnpm run generate-types` when Wrangler bindings change and `pnpm run deploy`
  only when explicitly requested.
- Content-only changes can be verified by reading the changed files plus
  `pnpm run format:check`; anything touching layout, routing, or generated
  pages needs a build or local preview.

## Branch Names

<!-- Shared across repos; sync deliberate changes to the other repos' AGENTS.md. -->

Use a short branch name of at most three words, separated by hyphens. Do not use slashes or type prefixes such as `feat/` or `fix/`. Examples: `session-recovery`, `fix-scroll-state`.

## Commits and PR Titles

Use conventional commit-style messages and PR titles: `type(scope): summary`.

Valid types are `feat`, `fix`, `docs`, `chore`, `refactor`, and `test`. Scopes are optional; useful ones here are `blog`, `homelab`, `projects`, `layout`, `content`, `styles`, `astro`, and `deploy`. Example: `fix(blog): correct post metadata`.

## Content

- Markdown is loaded with `import.meta.glob(..., { eager: true })`; there is no
  content collection config, and slugs come from filenames.
- Post frontmatter is `title` + `date`. Homelab frontmatter is typed in
  `src/lib/homelab.ts` (`HomelabFrontmatter`, fixed `componentCategories`
  order, `groupComponents`, `formatComponent`) — extend that module instead of
  parsing frontmatter inside a page.
- Site copy, headings, and page titles are lowercase and direct; prefer
  concrete work, dates, and specs over marketing claims.
- The first viewport is real content: a visitor should immediately understand
  the page or post they opened. Do not add instructional text about how the UI
  works.

## Styling

- Colors come from the CSS variables in `Base.astro` (Catppuccin Frappé dark,
  Latte light). Never hardcode hex values in page styles.
- Page-specific CSS belongs in that page's `<style>` block; only genuinely
  global rules go in `Base.astro`.
- Theme state lives in `localStorage` and is re-applied on `astro:after-swap`
  because `ClientRouter` replaces `<html>` attributes on navigation; the toggle
  uses click delegation because the button is swapped out on every navigation.
- Use semantic HTML and accessible labels before custom interaction. Text must
  not overflow nav, cards, or code blocks on mobile or desktop.

## Repo Patterns

- `src/pages/zekurio.keys.ts` and `zekurio.gpg.ts` mirror
  `github.com/zekurio.keys|.gpg` byte-for-byte via `src/lib/keys.ts`. They are
  prerendered at build time, so rotated keys only appear after a redeploy.
- `public/_headers` pins those two routes to `text/plain`, and
  `public/.assetsignore` keeps `_worker.js`/`_routes.json` out of the asset
  upload. Changing either endpoint means checking both files.
- Islands only when client interactivity is actually needed; everything else
  stays static Astro.

## Style Guide

- Avoid `try`/`catch` except at build, content, or deployment boundaries where
  a failure must be translated or recovered.
- Avoid `any`; narrow loose data with `unknown` or explicit local types. Rely
  on inference unless an annotation is needed for exports or clarity.
- Never alias or star-import. If a namespace-style value is needed, import the
  module's own exported namespace by name.
- Avoid unnecessary destructuring; use dot notation. Prefer `const`, early
  returns, and no `else`.
- Inline values and helpers used once; keep named intermediates only when they
  explain business logic. Keep synchronous work synchronous.
- Comment non-obvious constraints and surprising behavior (theme re-application,
  build-time key fetching), not obvious assignments or control flow.
- Duplicate logic across files is a code smell: extract into `src/lib` or the
  module that already owns it rather than adding isolated local logic.
