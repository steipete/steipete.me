# Peter Steinberger's Personal Website

Source for [steipete.me](https://steipete.me), built with [Astro](https://astro.build), styled with Tailwind CSS, and deployed on Vercel. Blog posts also have plain Markdown endpoints for [steipete.md](https://steipete.md).

## Development

Use Node 24 or newer and the pnpm version pinned in `package.json` (`corepack enable`).

| Command | Action |
| --- | --- |
| `pnpm install --frozen-lockfile` | Install the checked-in dependencies |
| `pnpm run dev` | Start the local development server at `localhost:4321` |
| `pnpm run check` | Check formatting and lint |
| `pnpm exec astro check` | Check Astro and TypeScript sources |
| `pnpm run build` | Build the static site and Pagefind search index into `dist/` |
| `pnpm run build:check` | Type-check and build the site and search index |
| `pnpm run preview` | Serve the production build for browser verification |

Search requires a production build. Social preview images are generated during the build using the licensed IBM Plex Mono fonts from `@ibm/plex-mono`; the build does not download fonts.

Dependency updates must be at least 48 hours old (`minimumReleaseAge` in `pnpm-workspace.yaml`). TypeScript stays on 6.x because `astro check` needs the compiler API that TypeScript 7 does not yet provide.

## Project structure

- `src/pages/`: HTML routes, RSS, robots.txt, and Markdown endpoints.
- `src/layouts/` and `src/components/`: Astro page templates and reusable UI.
- `src/content/blog/`: Markdown posts; `src/content.config.ts` defines frontmatter.
- `src/config.ts`: site settings; `src/constants.ts`: social and sharing links.
- `src/styles/global.css` and `typography.css`: Tailwind and article styles.
- `src/utils/`: post selection, URLs, reading time, and social preview generation.
- `public/`: stable asset URLs, fonts, and the early theme script.
- `astro.config.mjs`: Markdown processing, sitemap, PWA, and Vite configuration.
- `vercel.json`: build settings, redirects, Markdown negotiation, and HTTP headers.

See [AGENTS.md](AGENTS.md) for contribution conventions and [docs/YOUTUBE.MD](docs/YOUTUBE.MD) for video embeds.

## Deployment

Vercel builds GitHub pushes automatically with a frozen pnpm install and `pnpm run build`. There is no separate deployment script in this repository.

## License

Blog posts and documentation are [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); code and code snippets are [MIT](LICENSE).

The site began with [Sat Naing's AstroPaper theme](https://github.com/satnaing/astro-paper).
