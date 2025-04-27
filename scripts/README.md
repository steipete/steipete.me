# Scripts

This directory contains utility scripts for the steipete.me blog.

## Active Scripts

- `deploy.sh` - Script used for deployment
- `update-package-json.mjs` - Utility to update package.json files

## Reference Scripts

- `extract-original-titles.mjs` - Script used to extract original blog post titles from source repositories
- `original-titles-mapping.json` - JSON mapping of original post titles

## Archive

The `archive/` directory contains scripts that were used during the initial migration process and are kept for reference:

- `convert-posts.mjs` - Used for initial post conversion
- `import-posts.mjs` - Used for importing posts from original sources
- `fix-corrupted-blog-posts.mjs` - Used to fix corrupted blog posts
- `organize-old-images.mjs` - Used to organize images into year-based folders
- `restore-tags.mjs` - Used to restore tags to blog posts
- `add-source-metadata.js`/`add-source-metadata.mjs` - Used to add source metadata to posts
- `remove-tags-from-posts.mjs` - Used during tag migration
- `fix-missing-titles.mjs` - Used to fix missing titles in blog posts
- `check-blog-titles.mjs` - Used to check for blog posts with missing titles

These scripts are kept for historical reference but are no longer actively used now that the migration is complete.