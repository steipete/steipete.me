#!/bin/bash

# Script to organize remaining blog post files by extracting the year from the pubDate frontmatter
# Moves remaining files to year folders based on their publication date

# Set the working directory
BLOG_DIR="/Users/steipete/Projects/steipete-astro/src/content/blog"
cd "$BLOG_DIR" || { echo "Error: Cannot change to blog directory"; exit 1; }

# Create temporary files for reporting
report_file=$(mktemp)
moved_file=$(mktemp)
skipped_file=$(mktemp)

echo "Starting organization of remaining blog posts..."
echo "Finding files directly in the blog directory..."

# Get list of markdown files in the root directory
find "$BLOG_DIR" -maxdepth 1 -type f -name "*.md" -o -name "*.markdown" | sort | while read -r file; do
    filename=$(basename "$file")
    
    # Skip README files or other special files if any
    if [[ "$filename" == "README.md" || "$filename" == "index.md" ]]; then
        echo "Skipping special file: $filename" | tee -a "$report_file" "$skipped_file"
        continue
    fi
    
    # Extract the publication date from the file's frontmatter
    pubdate=$(grep -m 1 "pubDate:" "$file" | gsed -E 's/pubDate: +([0-9]{4})-[0-9]{2}-[0-9]{2}.*/\1/')
    
    # Skip if no pubdate found
    if [ -z "$pubdate" ]; then
        echo "No pubDate found in $filename, skipping" | tee -a "$report_file" "$skipped_file"
        continue
    fi
    
    # Target directory and file
    target_dir="$BLOG_DIR/$pubdate"
    target_file="$target_dir/$filename"
    
    # Create year folder if it doesn't exist
    if [ ! -d "$target_dir" ]; then
        echo "Creating year folder: $pubdate"
        mkdir -p "$target_dir"
    fi
    
    # Check if target file already exists in year folder
    if [ -f "$target_file" ]; then
        echo "File already exists in year folder: $pubdate/$filename, skipping" | tee -a "$report_file" "$skipped_file"
        continue
    fi
    
    # Move the file
    echo "Moving: $filename -> $pubdate/$filename" | tee -a "$report_file" "$moved_file"
    mv "$file" "$target_file"
done

# Count results
moved_count=$(wc -l < "$moved_file")
skipped_count=$(wc -l < "$skipped_file")
total_processed=$((moved_count + skipped_count))

# Print summary
echo ""
echo "=== Remaining Blog Post Organization Summary ==="
echo "Total files processed: $total_processed"
echo "Files moved to year folders: $moved_count"
echo "Files skipped: $skipped_count"
echo ""
echo "=== Details ==="
cat "$report_file"

# Clean up
rm "$report_file" "$moved_file" "$skipped_file"