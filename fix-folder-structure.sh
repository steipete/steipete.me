#!/bin/bash

# Script to fix folder structure issues from previous script
# Moves files from incorrectly named pubDate: folders to proper year folders

# Set the working directory
BLOG_DIR="/Users/steipete/Projects/steipete-astro/src/content/blog"
cd "$BLOG_DIR" || { echo "Error: Cannot change to blog directory"; exit 1; }

# Create temporary files for reporting
report_file=$(mktemp)
moved_file=$(mktemp)

echo "Starting folder structure fix..."

# Find all directories that start with "pubDate:"
find "$BLOG_DIR" -maxdepth 1 -type d -name "pubDate:*" | while read -r dir; do
    dirname=$(basename "$dir")
    
    # Extract the year from the directory name
    year=$(echo "$dirname" | gsed -E "s/.*([0-9]{4}).*/\1/")
    
    # Skip if we couldn't extract a valid year
    if ! [[ "$year" =~ ^[0-9]{4}$ ]]; then
        echo "Couldn't extract year from $dirname, skipping"
        continue
    fi
    
    # Create target year directory if it doesn't exist
    target_dir="$BLOG_DIR/$year"
    if [ ! -d "$target_dir" ]; then
        echo "Creating year folder: $year"
        mkdir -p "$target_dir"
    fi
    
    # Move all files from pubDate directory to year directory
    find "$dir" -maxdepth 1 -type f -name "*.md" -o -name "*.markdown" | while read -r file; do
        filename=$(basename "$file")
        target_file="$target_dir/$filename"
        
        # Check if target file already exists
        if [ -f "$target_file" ]; then
            echo "File already exists in target folder, comparing sizes..."
            source_size=$(wc -c < "$file")
            target_size=$(wc -c < "$target_file")
            
            if [ "$source_size" -gt "$target_size" ]; then
                echo "Replacing existing file with larger one: $filename -> $year/$filename" | tee -a "$report_file" "$moved_file"
                mv "$file" "$target_file"
            else
                echo "Keeping existing file, removing source: $filename" | tee -a "$report_file"
                rm "$file"
            fi
        else
            echo "Moving: $dirname/$filename -> $year/$filename" | tee -a "$report_file" "$moved_file"
            mv "$file" "$target_file"
        fi
    done
    
    # Remove the empty pubDate directory
    rmdir "$dir"
done

# Count results
moved_count=$(wc -l < "$moved_file")

# Print summary
echo ""
echo "=== Folder Structure Fix Summary ==="
echo "Files moved to correct year folders: $moved_count"
echo ""
echo "=== Details ==="
cat "$report_file"

# Clean up
rm "$report_file" "$moved_file"

# Final check for any blog posts left in the root directory
echo ""
echo "Checking for any remaining blog posts in root directory..."
find "$BLOG_DIR" -maxdepth 1 -type f -name "*.md" -o -name "*.markdown" | wc -l