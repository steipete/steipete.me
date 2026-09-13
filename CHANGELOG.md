# Changelog

All notable website architecture changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

- Fixed Markdown content negotiation and JavaScript-free steipete.md access with Vercel routing middleware before static-file lookup; restored nested legacy blog redirects and preserved dated post URLs.

- Fixed draft and scheduled posts leaking through a competing article route; HTML, Markdown, social images, archives, and search now share publication rules, with legacy article URLs retained as redirects.

- Made social-image builds deterministic and independent of Google Fonts outages by bundling the existing IBM Plex Mono font; CI now enforces Astro type checking alongside build, lint, and formatting.
- Updated compatible MDX, social-image, formatter, and pnpm tooling, removed unused theme dependencies, and enforce a 48-hour minimum dependency release age; Node 24 and TypeScript 6 compatibility are retained.

- Compatibility: removed the nonfunctional `deploy`, `add-source-metadata`, and `remove-tags` package scripts; their target scripts were absent. Vercel continues to deploy GitHub pushes automatically.

**Highlights:** Read the site as plain Markdown at steipete.md; dependency maintenance includes the latest Astro and image-processing security fixes.

- Added steipete.md domain support and raw Markdown endpoints for blog posts, the home page, about, archives, and post listings, with plain-text content types and caching (#130, #139).
- Redirected steipete.me Markdown URLs to steipete.md (#133).
- Fixed slow theme switching on iPhone Safari by limiting transitions to themed elements and enabling hardware acceleration (#122).
- Updated Astro to 7.3.2 and Sharp to 0.35.4, refreshed compatible dependencies, and resolved the remaining vulnerable transitive dependencies that blocked Dependabot security updates; includes the Astro/SVGO update from #266, thanks @dependabot.
- Updated checkout and Node setup actions to their current releases while retaining Node 24 and frozen pnpm installs.
- Refreshed React, Tailwind, lint/build tooling, and security-pinned transitive dependencies; moved pnpm overrides into the supported workspace configuration.

## [2025-01-06]

### Changed
- Updated email address from steipete@gmail.com to peter@steipete.me site-wide (#120)

### Added
- Smooth transitions for theme switching with CSS transitions (#119)
- Automatic theme switching based on system preferences (#115)
  - Respects user's OS dark/light mode preference
  - Manual toggle still available and persists user choice

### Improved
- Code block contrast in light mode for better readability (#117)

## [2025-01-05]

### Fixed
- Sitemap trailing slash mismatch issue (#113)
- Multiple SEO and technical issues (#112)
  - Improved meta descriptions
  - Fixed canonical URLs
  - Enhanced Open Graph tags
- Duplicate author name in OG images (#111)

### Added
- Structured data (JSON-LD) for better SEO (#102)
  - Article schema for blog posts
  - WebSite schema for homepage
  - Person schema for author information
- Critical CSS inlining for faster initial page render (#102)
- Keyboard navigation improvements (#102)
  - Arrow key navigation between posts
  - Escape key to close mobile menu

### Changed
- Updated tagline from "fork, remix, and ship" to "fork & remix" (#101)

### Fixed
- TypeScript errors in readingTime utility and astro.config (#100)
- Share links sizing and spacing on mobile devices (#99)

## [2025-01-04]

### Technical Infrastructure
- Migrated from steipete.com to steipete.me
- Set up modern Astro-based static site architecture
- Implemented automatic builds and deployments via Vercel
- Added PWA support with service worker
- Integrated Pagefind for site search functionality

### Performance Optimizations
- Implemented lazy loading for images
- Added responsive image sizing
- Optimized font loading with Atkinson Hyperlegible
- Reduced JavaScript bundle size
- Added caching strategies for static assets

### Developer Experience
- Added CLAUDE.md with project-specific instructions
- Set up TypeScript for type safety
- Configured ESLint for code quality
- Implemented hot module replacement for development
- Added comprehensive build scripts
