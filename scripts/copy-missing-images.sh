#!/bin/bash

# Script to copy missing images from temp-repos to public
# Uses missing-images.txt to identify images to copy

SOURCE_DIR="/Users/steipete/Projects/steipete-astro/temp-repos/steipete.com"
TARGET_DIR="/Users/steipete/Projects/steipete-astro/public"

# Process each line in missing-images.txt
while IFS= read -r line; do
  # Extract path from line that contains 'assets/img/'
  if [[ $line == *"assets/img/"* ]]; then
    # Extract the path
    path=$(echo "$line" | grep -o 'assets/img/[^ ]*' | head -1)
    
    # Check if path is valid
    if [[ -n "$path" ]]; then
      # Create target directory
      target_path="$TARGET_DIR/$path"
      target_dir=$(dirname "$target_path")
      mkdir -p "$target_dir"
      
      # Check if source file exists
      source_path="$SOURCE_DIR/$path"
      if [[ -f "$source_path" ]]; then
        echo "Copying $path"
        cp "$source_path" "$target_path"
      else
        echo "Source file not found: $source_path"
      fi
    fi
  fi
done < "/Users/steipete/Projects/steipete-astro/missing-images.txt"

echo "Image copying complete!"