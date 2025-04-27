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

# Check for duplicates based on title
echo "Checking for duplicates based on title..."
while read year_entry; do
  year_file=$(echo "$year_entry" | cut -d: -f1)
  year_title=$(echo "$year_entry" | cut -d: -f2- | sed 's/^ //')
  
  if grep -q ": $year_title$" /tmp/blog-titles/root_titles.txt; then
    root_file=$(grep ": $year_title$" /tmp/blog-titles/root_titles.txt | cut -d: -f1)
    echo "Duplicate found by title:"
    echo "  Year file: $year_file"
    echo "  Root file: $root_file"
    echo "  Title: $year_title"
    echo ""
  fi
done < /tmp/blog-titles/year_titles.txt

# Also compare filenames after removing date prefixes
echo "Checking for duplicates based on filenames..."
find src/content/blog/2020 src/content/blog/2021 -type f -name "*.md" | while read year_file; do
  base_name=$(basename "$year_file" .md)
  
  # Look for date-prefixed filename matches in root
  if find src/content/blog/ -maxdepth 1 -name "*-$base_name.md" | grep -q .; then
    matching_file=$(find src/content/blog/ -maxdepth 1 -name "*-$base_name.md")
    echo "Duplicate found by filename pattern:"
    echo "  Year file: $year_file"
    echo "  Root file: $matching_file"
    echo ""
  fi
  
  # Direct filename match
  if [ -f "src/content/blog/$base_name.md" ]; then
    echo "Duplicate found by exact filename:"
    echo "  Year file: $year_file"
    echo "  Root file: src/content/blog/$base_name.md"
    echo ""
  fi
done

# Clean up
rm -r /tmp/blog-titles

echo "Done checking for duplicates."