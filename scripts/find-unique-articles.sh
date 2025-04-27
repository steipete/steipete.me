#!/bin/bash

# Create a directory to store temporary files
mkdir -p /tmp/blog-titles

# Extract titles from each blog post in year directories
find src/content/blog/2020 src/content/blog/2021 -type f -name "*.md" | while read year_file; do
  base_name=$(basename "$year_file" .md)
  title=$(grep -m 1 "title:" "$year_file" | sed 's/title: "//' | sed 's/"$//' | sed 's/^[ \t]*//')
  if [ -n "$title" ]; then
    echo "$year_file: $title" >> /tmp/blog-titles/year_titles.txt
  fi
done

# Extract titles from root blog posts
find src/content/blog/ -maxdepth 1 -type f -name "*.md" | while read root_file; do
  base_name=$(basename "$root_file" .md)
  title=$(grep -m 1 "title:" "$root_file" | sed 's/title: "//' | sed 's/"$//' | sed 's/^[ \t]*//')
  if [ -n "$title" ]; then
    echo "$root_file: $title" >> /tmp/blog-titles/root_titles.txt
  fi
done

# Find unique articles (in year folders but not in root)
echo "Unique articles in year folders (not duplicated in root):"
echo "========================================================="

while read year_entry; do
  year_file=$(echo "$year_entry" | cut -d: -f1)
  year_title=$(echo "$year_entry" | cut -d: -f2- | sed 's/^ //')
  base_name=$(basename "$year_file" .md)
  
  # Skip if there's a matching title in root
  if grep -q ": $year_title$" /tmp/blog-titles/root_titles.txt; then
    continue
  fi
  
  # Skip if there's a matching filename pattern in root
  if find src/content/blog/ -maxdepth 1 -name "*-$base_name.md" | grep -q .; then
    continue
  fi
  
  # Skip if there's an exact filename match
  if [ -f "src/content/blog/$base_name.md" ]; then
    continue
  fi
  
  # This is a unique article
  echo "- $year_file"
  echo "  Title: $year_title"
  echo ""
done < /tmp/blog-titles/year_titles.txt

# Clean up
rm -r /tmp/blog-titles