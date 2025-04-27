#!/bin/bash

# Find all image references in the unique blog posts
echo "Checking for missing images in unique articles..."
echo "================================================"

# Array of unique article files
UNIQUE_FILES=(
  "src/content/blog/2020/apple-silicon-mac-mini-for-ci.md"
  "src/content/blog/2020/apple-silicon-m1-a-developer-perspective.md"
  "src/content/blog/2020/state-of-swiftui.md"
  "src/content/blog/2021/fixing-keyboardshortcut-in-swiftui.md"
  "src/content/blog/2021/top-level-menu-visibility-in-swiftui.md"
  "src/content/blog/2021/supporting-both-tap-and-longpress-on-button-in-swiftui.md"
)

for file in "${UNIQUE_FILES[@]}"; do
  echo "Analyzing $file..."
  
  # Extract the year and post name from the file path
  year=$(echo "$file" | grep -o '202[0-9]' | head -1)
  post_name=$(basename "$file" .md)
  
  # Find all markdown image references in the file
  grep -o '!\[.*\](.*\.png\|.*\.jpg\|.*\.jpeg\|.*\.gif)' "$file" | while read -r img_ref; do
    # Extract the image path from the markdown reference
    img_path=$(echo "$img_ref" | sed -E 's/!\[.*\]\((.*)\)/\1/')
    
    # Check if the image path starts with /assets
    if [[ "$img_path" == /assets* ]]; then
      # Remove the leading slash
      img_path="${img_path:1}"
      
      # Check if the image exists in the public directory
      if [ ! -f "public$img_path" ]; then
        echo "  Missing image: $img_path"
        
        # Check if it exists in the temp-repos directory
        original_img="temp-repos/steipete.com$img_path"
        if [ -f "$original_img" ]; then
          echo "  Found in: $original_img"
          
          # Create directory structure if it doesn't exist
          mkdir -p "$(dirname "public$img_path")"
          
          # Copy the image
          echo "  → Copying to public$img_path"
          cp "$original_img" "public$img_path"
        else
          echo "  NOT FOUND in temp-repos/steipete.com$img_path"
        fi
        echo ""
      fi
    fi
  done
done

echo "Done checking for missing images."