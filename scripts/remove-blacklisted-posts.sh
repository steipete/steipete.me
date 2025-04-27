#!/bin/bash

# Remove blacklisted posts
# Created by Claude on April 27, 2025

TARGET_DIR="/Users/steipete/Projects/steipete.me/src/content/blog/pspdfkit"
BLACKLIST_FILE="/Users/steipete/Projects/steipete.me/scripts/blacklist.txt"

# Check if files exist
if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Target directory does not exist: $TARGET_DIR"
  exit 1
fi

if [ ! -f "$BLACKLIST_FILE" ]; then
  echo "Error: Blacklist file does not exist: $BLACKLIST_FILE"
  exit 1
fi

# Get the list of files to remove
while IFS= read -r file; do
  # Skip empty lines
  if [ -z "$file" ]; then
    continue
  fi
  
  # Build the full path
  file_path="$TARGET_DIR/$file"
  
  # Check if file exists and remove
  if [ -f "$file_path" ]; then
    echo "Removing $file"
    rm -f "$file_path"
  else
    echo "Warning: File does not exist: $file_path"
  fi
done < "$BLACKLIST_FILE"

echo "Done removing blacklisted posts."

# Count remaining files
remaining=$(find "$TARGET_DIR" -name "*.md" | wc -l)
echo "Remaining posts: $remaining"