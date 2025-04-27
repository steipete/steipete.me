# Archived Scripts

This directory contains scripts that were used during the initial blog migration process. They are kept for historical reference but are no longer actively used.

## Migration Scripts

- `convert-posts.mjs` - Converted posts from the original Jekyll format to Astro's MDX format
- `import-posts.mjs` - Imported posts from steipete.com and petersteinberger.com
- `fix-corrupted-blog-posts.mjs` - Fixed blog posts with corrupted frontmatter, missing titles, or garbled descriptions
- `organize-old-images.mjs` - Organized images referenced by old articles into year-based folders (public/assets/img/{year})
- `restore-tags.mjs` - Restored tags that were mistakenly removed from markdown content
- `add-source-metadata.js`/`add-source-metadata.mjs` - Added source metadata to track origin (steipete.com or petersteinberger.com)
- `remove-tags-from-posts.mjs` - Temporary script used during tag migration
- `fix-missing-titles.mjs` - Added titles to blog posts that were missing them
- `check-blog-titles.mjs` - Checked all blog posts to ensure they have titles

These scripts completed their purpose during the migration process and are no longer needed for regular site operation.