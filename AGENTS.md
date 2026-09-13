# Working on this site

Use the Node version declared in `package.json` (currently Node 24+) and the pinned pnpm version through Corepack. Run `pnpm run check`, `pnpm exec astro check`, and `pnpm run build` before landing changes. The production build includes the Pagefind search index. Use `pnpm run preview` for browser verification; do not leave a development server running unattended.

Site configuration lives in `src/config.ts`; social and sharing links live in `src/constants.ts`. `src/content.config.ts` defines the blog frontmatter schema. Vercel handles automatic GitHub deployments and the redirects, content negotiation, and security headers in `vercel.json`.

## Blog content

Never create or propose blog content without Peter's explicit request. For a requested new post:

- If no topic/title is supplied, ask for it.
- Use a short branch slug and scaffold `src/content/blog/<year>/<slug>.md`.
- Set only the supplied title plus required placeholders: `description: "TBD"`, `draft: true`, and `pubDatetime: <today>`.
- Leave the body empty and open the file with `code`.

Keep existing public asset URLs stable. Historical post images live under `public/assets/`.

## Dependencies

Query the registry for current compatible stable versions; never guess versions or downgrade to hide a failure. Use pnpm to update the lockfile, then run the full checks and production build. Follow the task's release-age policy.
