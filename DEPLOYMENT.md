# Deployment

Live: <https://magicbridge.razzrohith.com>

Static hosting on GitHub Pages, free tier, no backend.

## How it works

`main` is the deploy branch. Every push runs `.github/workflows/deploy.yml`,
which installs with pnpm, runs `pnpm build`, and publishes `out/`.

The build is a Next.js **static export** (`output: "export"` in
`next.config.ts`), so the whole site is plain HTML/CSS/JS. Consequences worth
remembering:

- No server. No API routes, server actions, ISR, or `next/image` optimization.
- Metadata and `next/og` routes (`robots`, `sitemap`, `opengraph-image`,
  `apple-icon`) each need `export const dynamic = "force-static"`, or the build
  fails when it tries to prerender them.
- `trailingSlash: true`, because Pages resolves `/foo` as `/foo/index.html`.

## The custom domain

`public/CNAME` holds `magicbridge.razzrohith.com` and is copied verbatim into
`out/` on every build. **Do not delete it**: Pages reads that file on each
deploy, so losing it silently drops the domain back to
`razzrohith.github.io/magicbridge`.

`public/.nojekyll` keeps the `_next` directory from being mistaken for Jekyll
internals.

DNS lives at the registrar for `razzrohith.com`:
`CNAME  magicbridge  ->  razzrohith.github.io`

## Local

```bash
pnpm dev                 # dev server, localhost:3000
pnpm build && pnpm start # build the export, serve out/ on localhost:3001
```

`pnpm start` serves the exported folder; `next start` does not work with a
static export.
