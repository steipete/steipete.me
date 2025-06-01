# Peter Steinberger's Personal Website

This is the source code for my personal website, built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

## About

I'm Peter Steinberger, an iOS developer, entrepreneur, and open source contributor. This website hosts my personal blog and information about my work.

## Features

- ✅ Modern, fast, and responsive website built with Astro
- ✅ Blog with full markdown support
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap and RSS feed support
- ✅ Import of posts from previous blogs

## Project Structure

```text
├── public/           # Static assets like images
├── scripts/          # Utility scripts
├── src/
│   ├── components/   # Reusable UI components
│   ├── content/      # Blog posts and content collections
│   │   ├── blog/     # Blog posts in Markdown format
│   │   └── config.ts # Content configuration
│   ├── layouts/      # Page layouts
│   └── pages/        # Pages and routes
├── astro.config.mjs  # Astro configuration
├── vercel.json       # Vercel deployment configuration
└── package.json      # Project dependencies and scripts
```

## Commands

| Command                | Action                                      |
| :--------------------- | :------------------------------------------ |
| `npm install`          | Installs dependencies                       |
| `npm run dev`          | Starts local dev server at `localhost:4321` |
| `npm run build`        | Build the production site to `./dist/`      |
| `npm run preview`      | Preview the build locally, before deploying |

## Deployment

This site is set up for easy deployment on Vercel. Just connect your GitHub repository to Vercel, and it will automatically build and deploy the site when changes are pushed.

## License

This repository uses dual licensing:

- **Documentation & Blog Posts**: Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
- **Code & Code Snippets**: Licensed under the [MIT License](LICENSE)

See the [LICENSE](LICENSE) file for full details.
