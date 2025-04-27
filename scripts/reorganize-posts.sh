#!/bin/bash

# Script to reorganize blog posts into year folders with the date prefix removed
# Run this script from the project root directory

set -e

# Check if we're in the right directory
if [ ! -d "src/content/blog" ]; then
  echo "Error: src/content/blog directory not found. Please run this script from the project root."
  exit 1
fi

echo "=== Blog Post Reorganization ==="
echo "This will move all blog posts into year folders and remove date prefixes."
echo "Scanning blog posts..."

# Process blog posts with date prefixes
for file in src/content/blog/*.{md,mdx,markdown}; do
  # Skip if no matches
  [ -e "$file" ] || continue
  
  # Extract the year, slug from filename
  filename=$(basename "$file")
  if [[ $filename =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)$ ]]; then
    year="${BASH_REMATCH[1]}"
    slug="${BASH_REMATCH[4]}"
    
    # Create year directory if it doesn't exist
    mkdir -p "src/content/blog/$year"
    
    # Move the file to the year directory with the new name
    echo "Moving $filename to $year/$slug"
    mv "$file" "src/content/blog/$year/$slug"
  fi
done

echo "Reorganization complete!"
echo "Building project to verify changes..."
npm run build

echo "All blog posts have been reorganized into year folders with date prefixes removed."