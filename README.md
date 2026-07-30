# zekurio.me

Personal site of Michael S.: projects, homelab systems, a blog, and plaintext
mirrors of my public SSH and GPG keys. Built with Astro, rendered fully static,
and deployed as Cloudflare Workers static assets.

### Development

With [direnv](https://direnv.net/) and Nix (provides Node 24 and pnpm):

```sh
direnv allow
pnpm install
pnpm dev
```

Without Nix: install Node 24.14.0 and pnpm 10, then `pnpm install && pnpm dev`.

`pnpm preview` builds the site and serves `dist/` through the local Workers
runtime (`wrangler dev`), which is the closest match to production.

### Content

Blog posts are markdown files in `src/content/posts` with `title` and `date`
frontmatter. Homelab systems are markdown files in `src/content/homelab` with
structured `components` frontmatter (category, name, optional label, count,
size) typed in `src/lib/homelab.ts`. In both cases the filename becomes the
slug, so `src/content/posts/hello-world.md` is served at `/blog/hello-world`.

### Endpoints

`/zekurio.keys` and `/zekurio.gpg` mirror GitHub's plaintext key endpoints
byte-for-byte, so they can be piped straight into `authorized_keys` or `gpg
--import`. They are fetched at build time, so key rotations show up after the
next deploy.

### Deployment

```sh
pnpm run deploy
```

Builds the site and uploads `dist/` with Wrangler using the configuration in
[`wrangler.jsonc`](wrangler.jsonc). Run `pnpm run generate-types` after
changing Cloudflare bindings.

Before committing, run `pnpm run format:check`, `pnpm run lint`, and
`pnpm run build`. [`AGENTS.md`](AGENTS.md) covers the repo's conventions.

### License

[MIT](LICENSE)
