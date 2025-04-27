#!/bin/bash

# Define directories
BLOG_DIR="/Users/steipete/Projects/steipete-astro/src/content/blog"
PUBLIC_DIR="/Users/steipete/Projects/steipete-astro/public"
TEMP_REPOS_DIR="/Users/steipete/Projects/steipete-astro/temp-repos/steipete.com/assets"
MISSING_IMAGES_FILE="/Users/steipete/Projects/steipete-astro/missing-images.txt"

# Create or clear the missing images file
> "$MISSING_IMAGES_FILE"

# Function to check if an image exists in the public directory
check_image_exists() {
  local img_path="$1"
  
  # Remove the leading slash if it exists
  img_path="${img_path#/}"
  
  # Check if the image exists in the public directory
  if [[ -f "$PUBLIC_DIR/$img_path" ]]; then
    return 0
  else
    # Check if the image exists in the temp repos directory
    if [[ -f "$TEMP_REPOS_DIR/${img_path#assets/}" ]]; then
      echo "Image missing in public but found in temp-repos: $img_path"
      echo "Missing: $img_path (FOUND IN TEMP REPOS)" >> "$MISSING_IMAGES_FILE"
      return 1
    else
      echo "Image missing: $img_path"
      echo "Missing: $img_path" >> "$MISSING_IMAGES_FILE"
      return 1
    fi
  fi
}

# Find all markdown files in the blog directory
find "$BLOG_DIR" -name "*.md" -o -name "*.markdown" | while read -r file; do
  echo "Checking file: $file"
  
  # Extract the heroImage from frontmatter
  hero_image=$(grep -i "heroImage:" "$file" | sed 's/.*heroImage: *//' | tr -d "'\"")
  
  if [[ -n "$hero_image" ]]; then
    check_image_exists "$hero_image"
  fi
  
  # Extract image paths from markdown syntax: ![...](path)
  grep -o '!\[.*\]([^)]\+)' "$file" | sed 's/.*(\([^)]*\))/\1/' | while read -r img_path; do
    if [[ "$img_path" == http* ]]; then
      # Skip external URLs
      continue
    fi
    check_image_exists "$img_path"
  done
  
  # Extract image paths from HTML img tags: <img src="path" ...>
  grep -o '<img [^>]*src="[^"]*"[^>]*>' "$file" | sed 's/.*src="\([^"]*\)".*/\1/' | while read -r img_path; do
    if [[ "$img_path" == http* ]]; then
      # Skip external URLs
      continue
    fi
    check_image_exists "$img_path"
  done
done

echo "Check complete. Missing images are listed in $MISSING_IMAGES_FILE"

# Count the number of missing images
MISSING_COUNT=$(wc -l < "$MISSING_IMAGES_FILE")
echo "Total missing images: $MISSING_COUNT"