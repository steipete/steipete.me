#!/bin/bash

# Script to reorganize PSPDFKit images into the main blog image structure
# This moves images from /public/assets/img/pspdfkit to /public/assets/img

set -e

echo "Starting PSPDFKit image reorganization..."

# Get the root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Create a log file
LOG_FILE="$ROOT_DIR/scripts/pspdfkit-images-moved.txt"
> "$LOG_FILE"

# Check if the PSPDFKit images directory exists
if [ ! -d "$ROOT_DIR/public/assets/img/pspdfkit" ]; then
  echo "PSPDFKit images directory not found: $ROOT_DIR/public/assets/img/pspdfkit"
  exit 1
fi

# Find all images in the PSPDFKit directory
find "$ROOT_DIR/public/assets/img/pspdfkit" -type f -not -path "*/\.*" | while read -r img_path; do
  # Get relative path to the pspdfkit directory
  rel_path="${img_path#$ROOT_DIR/public/assets/img/pspdfkit/}"
  
  # Extract year and the rest of the path
  year=$(echo "$rel_path" | cut -d'/' -f1)
  subpath=$(echo "$rel_path" | cut -d'/' -f2-)
  
  # Create target directory
  target_dir="$ROOT_DIR/public/assets/img/$year/$subpath"
  target_dir=$(dirname "$target_dir")
  
  # Create target directory if it doesn't exist
  mkdir -p "$target_dir"
  
  # Get just the filename
  filename=$(basename "$img_path")
  
  # Full target path
  target_path="$target_dir/$filename"
  
  # Move the file
  cp "$img_path" "$target_path"
  
  # Log the move
  echo "Moved: $img_path -> $target_path" >> "$LOG_FILE"
done

echo "Image reorganization complete. See $LOG_FILE for details."
echo "Remember to update image references in blog posts."

# Next step: Find and update image references in markdown files
echo "Searching for image references to update..."

# Find all blog posts that might reference PSPDFKit images
find "$ROOT_DIR/src/content/blog" -name "*.md" | xargs grep -l "/assets/img/pspdfkit/" | while read -r post; do
  # Make a backup of the original file
  cp "$post" "${post}.bak"
  
  # Replace image references in the post
  gsed -i 's|/assets/img/pspdfkit/|/assets/img/|g' "$post"
  
  echo "Updated references in: $post"
done

echo "Updated image references in markdown files."
echo "Please check the changes and commit them if they look good."
echo "After verifying everything works, you can remove the PSPDFKit image directory."