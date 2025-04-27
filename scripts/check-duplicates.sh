#!/bin/bash

# Check for duplicates between year-structured blog posts and root blog posts
echo "Checking for duplicates between year-structured blog posts and root blog posts..."

for year_file in $(find src/content/blog/2020 src/content/blog/2021 -type f -name "*.md"); do
  # Extract title from year file
  year_title=$(grep -m 1 "title:" "$year_file" | sed 's/title: "//' | sed 's/"$//' | sed 's/^[ \t]*//')
  
  # Search for this title in root blog files
  if [ -n "$year_title" ]; then
    root_file=$(grep -l "title: \"$year_title\"" src/content/blog/*.md 2>/dev/null || true)
    
    if [ -n "$root_file" ]; then
      echo "Duplicate found:"
      echo "  Year file: $year_file"
      echo "  Root file: $root_file"
      echo "  Title: $year_title"
      echo ""
    fi
  fi
done

echo "Done checking for duplicates."