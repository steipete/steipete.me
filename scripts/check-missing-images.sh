#!/bin/bash

# This script checks for missing images in markdown files

echo "Checking for missing images in markdown files..."
echo "============================================="

# Process all markdown files
find src/content/blog/ -name "*.md" | while read md_file; do
  # Extract image paths without attributes
  grep -o '!\[.*\]([^)]*)' "$md_file" | sed 's/!\[.*\](//' | while read img_path; do
    # Skip URLs and focus only on local assets starting with /assets
    if [[ "$img_path" != /assets* ]]; then
      continue
    fi
    
    # Check if the image exists in the public directory
    if [ ! -f "public$img_path" ]; then
      echo "Missing in $md_file:"
      echo "  $img_path"
      
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
done

echo "Done checking for missing images."