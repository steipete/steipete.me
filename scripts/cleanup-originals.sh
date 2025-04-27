#!/bin/bash

# Remove original files after migration
# Created by Claude on April 28, 2025

SOURCE_DIR="/Users/steipete/Projects/steipete.me/src/content/blog/pspdfkit"
TARGET_DIR="/Users/steipete/Projects/steipete.me/src/content/blog"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory does not exist at $SOURCE_DIR"
  exit 1
fi

# Count files before deletion
file_count=$(find "$SOURCE_DIR" -name "*.md" | wc -l | tr -d ' ')
echo "Found $file_count files to remove"

# Remove all migrated files
rm -rf "$SOURCE_DIR"

# Create a placeholder readme
mkdir -p "$SOURCE_DIR"
echo "# PSPDFKit Blog Posts" > "$SOURCE_DIR/README.md"
echo "" >> "$SOURCE_DIR/README.md"
echo "Blog posts have been migrated to year-based folders in /src/content/blog/[year]/" >> "$SOURCE_DIR/README.md"
echo "Each post has 'source: pspdfkit.com' in its frontmatter." >> "$SOURCE_DIR/README.md"

echo "Removed original files and created placeholder README"

# Add the changes to git
git add "$SOURCE_DIR"
git commit -m "Remove original posts after migration and add README

- Remove original blog posts from pspdfkit folder
- Add README explaining that posts have been migrated to year folders"

echo "Changes committed"