#!/bin/bash

# Copy all non-release blog posts authored by Peter Steinberger from PSPDFKit website to steipete.me
# Created by Claude on April 27, 2025

SOURCE_DIR="/Users/steipete/Documents/Projects/PSPDFKit-Website"
TARGET_DIR="/Users/steipete/Projects/steipete.me"
BLACKLIST_FILE="$TARGET_DIR/scripts/blacklist.txt"

# Create target directory
mkdir -p "$TARGET_DIR/src/content/blog/pspdfkit"

# Load blacklist if it exists
BLACKLIST=()
if [ -f "$BLACKLIST_FILE" ]; then
  while IFS= read -r line; do
    # Skip empty lines
    if [ -n "$line" ]; then
      BLACKLIST+=("$line")
    fi
  done < "$BLACKLIST_FILE"
  echo "Loaded ${#BLACKLIST[@]} items from blacklist"
fi

# Find all blog posts mentioning Peter that aren't release posts
BLOG_POSTS=$(find $SOURCE_DIR/source/blog -name "*.md" | xargs grep -l "Peter Steinberger" | grep -v "pspdfkit-.*[0-9]")

# Log what we're doing
echo "Found $(echo "$BLOG_POSTS" | wc -l | tr -d ' ') blog posts authored by Peter Steinberger"

# Copy each blog post
copied_count=0
skipped_count=0

for post in $BLOG_POSTS
do
  filename=$(basename "$post")
  
  # Check if file is blacklisted
  blacklisted=0
  for blacklisted_file in "${BLACKLIST[@]}"; do
    if [ "$filename" = "$blacklisted_file" ]; then
      blacklisted=1
      break
    fi
  done
  
  if [ $blacklisted -eq 1 ]; then
    echo "Skipping blacklisted file: $filename"
    skipped_count=$((skipped_count+1))
    continue
  fi
  
  echo "Copying $filename..."
  cp "$post" "$TARGET_DIR/src/content/blog/pspdfkit/"
  copied_count=$((copied_count+1))
  
  # Extract year and post name from the path
  year=$(echo "$post" | grep -o '/[0-9]\{4\}/' | tr -d '/')
  post_name=$(basename "$post" .html.md)
  
  # Find and copy images for this post
  img_refs=$(grep -o '/images/blog/[^)]*' "$post" | tr -d ')' || true)
  
  if [ -n "$img_refs" ]; then
    for img_ref in $img_refs
    do
      # Create target directory structure
      img_dir=$(dirname "$img_ref" | sed 's|/images/blog|/public/assets/img/pspdfkit|')
      mkdir -p "$TARGET_DIR$img_dir"
      
      # Copy the image
      source_img="$SOURCE_DIR/source$img_ref"
      target_img="$TARGET_DIR$img_dir/$(basename "$img_ref")"
      
      if [ -f "$source_img" ]; then
        echo "  Copying image: $source_img -> $target_img"
        cp "$source_img" "$target_img"
      else
        echo "  Warning: Image not found: $source_img"
      fi
    done
  fi
done

echo "Done copying blog posts and images."
echo "Copied: $copied_count posts"
echo "Skipped (blacklisted): $skipped_count posts"