# Jasontopia

Source for the Jasontopia personal website at <https://jasontopia.me>.

The site is an Astro blog/site with React components, Tailwind styling, Pagefind search, RSS, sitemap generation, PWA support, and Vercel analytics. The current visual style is intentionally preserved; avoid broad design refreshes unless that is the explicit task.

## Tech Stack

- Astro
- React
- Tailwind CSS
- pnpm
- Vercel

## Local Development

This project uses pnpm. The expected Node version is `>=24.0.0`.

```sh
pnpm install
pnpm run dev
```

The dev server starts with `astro dev`, usually at <http://localhost:4321>.

## Build And Check

```sh
pnpm run build
pnpm run build:check
pnpm run check
pnpm run preview
```

- `pnpm run build` builds the Astro site and creates the Pagefind index in `dist/`.
- `pnpm run build:check` runs `astro check`, builds the site, and creates the Pagefind index.
- `pnpm run check` runs formatting and lint checks.
- `pnpm run preview` previews the built site locally.

Use `pnpm run check:fix` for local format/lint fixes.

## Deployment

The project is configured for Vercel in `vercel.json`:

- Framework: Astro
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm run build`
- Output directory: `dist`
- Dev command: `pnpm run dev`

The canonical domain is `https://jasontopia.me`. Vercel redirects `www.jasontopia.me` and other configured host/path variants to the canonical domain, and `astro.config.mjs` uses `SITE.website` for the site URL.

## Content Notes

Blog content lives in `src/content/blog/`, with many posts organized by year. Legacy imported posts remain in the repo for now, but hidden posts are marked with `unlisted: true`; draft posts use `draft: true`.

Public post filtering excludes drafts, unlisted posts, and future scheduled posts outside the configured margin. Keep legacy content hidden/unlisted unless there is an explicit decision to publish it.

## Project Structure

```text
.
├── public/              # Static assets served as-is
├── src/
│   ├── assets/          # Local icons and images used by the app
│   ├── components/      # Astro and React UI components
│   ├── content/         # Astro content collections
│   │   └── blog/        # Blog posts in Markdown/MDX
│   ├── layouts/         # Page and post layouts
│   ├── pages/           # Astro routes and generated markdown endpoints
│   ├── styles/          # Global, Tailwind, typography, and custom styles
│   └── utils/           # Site utilities, filters, OG image helpers
├── astro.config.mjs     # Astro integrations and build configuration
├── package.json         # Scripts, dependencies, pnpm metadata
├── pnpm-lock.yaml       # pnpm lockfile
└── vercel.json          # Vercel build, redirects, rewrites, and headers
```

## License

See [LICENSE](LICENSE).
