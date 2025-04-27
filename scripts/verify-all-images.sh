#!/bin/bash

# This script checks all markdown files for missing images

# Get all unique image references from markdown files
find src/content/blog/ -name "*.md" | xargs cat | grep -o '/assets/img/[^)]*' | sort | uniq > /tmp/all_image_refs.txt

echo "Checking all image references..."
echo "============================="

# Check each image reference
cat /tmp/all_image_refs.txt | while read img_path; do
  # Check if the image exists in the public directory
  if [ ! -f "public$img_path" ]; then
    echo "Missing: $img_path"
    
    # Check if it exists in the temp-repos directory
    original_img="temp-repos/steipete.com$img_path"
    if [ -f "$original_img" ]; then
      echo "  Found in: $original_img"
      
      # Create directory structure if it doesn't exist
      mkdir -p "$(dirname "public$img_path")"
      
      # Copy the image
      echo "  → Copying to public$img_path"
      cp "$original_img" "public$img_path"
      echo ""
    else
      echo "  NOT FOUND in temp-repos/steipete.com$img_path"
      echo ""
    fi
  fi
done

echo "Done checking for missing images."