# Blog Post Reorganization

This directory contains scripts for reorganizing blog posts into a cleaner, more maintainable structure.

## Purpose

The reorganization aims to:

1. Move all blog posts into year-based folders
2. Remove date prefixes from filenames
3. Maintain all content and metadata intact
4. Preserve URL structure and redirects

## Scripts

### `reorganize-posts.sh`

A simple shell script that:
- Finds all markdown files with date prefixes in the root blog directory
- Extracts the year from the filename
- Creates year directories if they don't exist
- Moves files into year directories with the date prefix removed
- Verifies the site builds correctly after reorganization

Usage:
```bash
./scripts/reorganize-posts.sh
```

### `reorganize-blog-posts.mjs`

A more robust JavaScript implementation that:
- Finds all markdown files using proper Node.js file API
- Handles edge cases and provides better error reporting
- Shows a preview of changes before executing them
- Provides detailed statistics of the reorganization

Usage:
```bash
node scripts/reorganize-blog-posts.mjs
```

## Outcome

The reorganization transforms the blog structure from:

```
/src/content/blog/
├── 2012-04-05-dont-call-willchangevalueforkey.markdown
├── 2012-04-05-reboot.markdown
├── ...
```

To a cleaner organization:

```
/src/content/blog/
├── 2012/
│   ├── dont-call-willchangevalueforkey.markdown
│   ├── reboot.markdown
│   └── ...
├── 2013/
│   └── ...
...
```

This structure is:
- More maintainable and easier to navigate
- Aligned with content organization best practices
- Preserves all URLs through Astro's routing system