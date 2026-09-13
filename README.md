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
| `pnpm run test` | Run unit regressions |
| `pnpm run build:check` | Type-check, test, build, and verify public artifacts |
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
- `vercel.json`: build settings, redirects, and HTTP headers; `src/proxy.ts` negotiates Markdown before Vercel serves static files.

See [AGENTS.md](AGENTS.md) for contribution conventions and [docs/YOUTUBE.MD](docs/YOUTUBE.MD) for video embeds.

## Deployment

Vercel builds GitHub pushes automatically with Corepack, a frozen pnpm install, and `pnpm run build`. It uses the static preset (`framework: null`) so the routing proxy runs before the existing Astro-generated files in `dist/`. The Astro preset reserves middleware ownership for the framework and rejects a custom proxy. There is no separate deployment script in this repository.

## License

Blog posts and documentation are [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); code and code snippets are [MIT](LICENSE).

The site began with [Sat Naing's AstroPaper theme](https://github.com/satnaing/astro-paper).

Drafts never publish. Scheduled posts publish within the configured 15-minute margin; development can preview future posts. Unlisted posts are accessible directly and omitted from listings and search. Each post keeps its established canonical URL; legacy aliases redirect to it.

Vercel routing middleware serves Markdown for explicit `Accept: text/markdown` requests and on steipete.md. It honors media-type quality values and handles GET/HEAD only. `pnpm run preview` serves static files; verify host/header negotiation on a Vercel preview.
