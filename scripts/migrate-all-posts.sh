#!/bin/bash

# Migrate all PSPDFKit posts to steipete.me format
# Created by Claude on April 28, 2025

SOURCE_DIR="/Users/steipete/Projects/steipete.me/src/content/blog/pspdfkit"
SCRIPT="/Users/steipete/Projects/steipete.me/scripts/migrate-post.js"

# Check if script exists
if [ ! -f "$SCRIPT" ]; then
  echo "Error: Migration script does not exist at $SCRIPT"
  exit 1
fi

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory does not exist at $SOURCE_DIR"
  exit 1
fi

# Create a branch for our changes
git_branch="migrate-pspdfkit-blog-posts"
git checkout -b "$git_branch" || { echo "Failed to create git branch"; exit 1; }
echo "Created branch: $git_branch"

# Find all blog posts and migrate them
for file in "$SOURCE_DIR"/*.md; do
  echo "Migrating $file..."
  node "$SCRIPT" "$file"
done

echo "Migration completed!"

# Clean up original files
echo "Cleaning up original files..."
rm -rf "$SOURCE_DIR"

# Create a placeholder readme
mkdir -p "$SOURCE_DIR"
echo "# PSPDFKit Blog Posts" > "$SOURCE_DIR/README.md"
echo "" >> "$SOURCE_DIR/README.md"
echo "Blog posts have been migrated to year-based folders in /src/content/blog/[year]/" >> "$SOURCE_DIR/README.md"
echo "Each post has 'source: pspdfkit.com' in its frontmatter." >> "$SOURCE_DIR/README.md"

# Create a pull request
echo "Creating PR..."
git add /Users/steipete/Projects/steipete.me/src/content/blog/
git add /Users/steipete/Projects/steipete.me/public/assets/img/

git commit -m "Migrate PSPDFKit blog posts to new format

This PR migrates blog posts from PSPDFKit to the steipete.me format.
- Organizes posts into year-based folders
- Adds AI-generated descriptions
- Adds source attribution
- Migrates images to the correct locations
- Updates image paths in the posts
- Removes original files from pspdfkit folder
- Adds README explaining migration"

git push --set-upstream origin "$git_branch"

# Use GitHub CLI to create a PR
if command -v gh &> /dev/null; then
  gh pr create --title "Migrate PSPDFKit blog posts" --body "This PR migrates blog posts from PSPDFKit to the steipete.me format.

## Changes:
- Organizes posts into year-based folders
- Adds AI-generated descriptions
- Adds source attribution
- Migrates images to the correct locations
- Updates image paths in the posts
- Removes original files from pspdfkit folder
- Adds README explaining migration

## Note:
Original source is marked in each post with 'source: pspdfkit.com'"
  
  echo "PR created successfully!"
else
  echo "GitHub CLI not found. Please create the PR manually."
fi