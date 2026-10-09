# zekurio.me

My personal site. It has my projects, my homelab systems, a blog, and
plaintext copies of my public SSH and GPG keys. It's built with Astro,
rendered fully static, and deployed as Cloudflare Workers static assets.

### Development

With [direnv](https://direnv.net/) and Nix, the devshell provides Node 24 and
pnpm:

```sh
direnv allow
pnpm install
pnpm dev
```

Without Nix, install Node 24.14.0 and pnpm 10, then run
`pnpm install && pnpm dev`.

`pnpm preview` builds the site and serves `dist/` with `wrangler dev`. That's
the same Workers runtime production uses, so check things there before
deploying.

### Content

Blog posts are markdown files in `src/content/posts` with `title` and `date`
in the frontmatter. The filename is the slug, so
`src/content/posts/hello-world.md` ends up at `/blog/hello-world`.

Homelab systems aren't markdown. They live in the `homelabSystems` array in
`src/lib/homelab.ts`. Each system has a name, which doubles as the slug, a
description, an optional role and os, and components keyed by category such as
`cpu`, `memory`, or `storage`. A component has a name and an optional label,
count, and size.

### Endpoints

`/zekurio.keys` and `/zekurio.gpg` match GitHub's plaintext key endpoints
byte-for-byte. You can pipe them straight into `authorized_keys` or
`gpg --import`. The build fetches them from GitHub, so a rotated key only
shows up after the next deploy.

### Deployment

```sh
pnpm run deploy
```

This builds the site and uploads `dist/` with Wrangler, using
[`wrangler.jsonc`](wrangler.jsonc). Run `pnpm run generate-types` after
changing Cloudflare bindings.

Before committing, run `pnpm run format:check`, `pnpm run lint`,
`pnpm run typecheck`, and `pnpm run build`. The repo's conventions are in
[`AGENTS.md`](AGENTS.md).

### License

[MIT](LICENSE)
