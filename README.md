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
| `npm run import-posts` | Import posts from GitHub repositories       |

## Import Blog Posts

This project includes a script to import blog posts from my previous GitHub repositories:

```bash
npm run import-posts
```

This will fetch and convert posts from:

- https://github.com/steipete/steipete.com
- https://github.com/steipete/petersteinberger.com

## Deployment

This site is set up for easy deployment on Vercel. Just connect your GitHub repository to Vercel, and it will automatically build and deploy the site when changes are pushed.

## License

The content of this project is copyrighted by Peter Steinberger. The code is licensed under the MIT license.
