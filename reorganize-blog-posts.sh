#!/bin/bash

# Script to reorganize blog post files
# Moves files with date prefixes to year folders and removes the date prefix

# Set the working directory
BLOG_DIR="/Users/steipete/Projects/steipete-astro/src/content/blog"
cd "$BLOG_DIR" || { echo "Error: Cannot change to blog directory"; exit 1; }

# Create temporary files for reporting
report_file=$(mktemp)
moved_file=$(mktemp)
skipped_file=$(mktemp)
conflict_resolved_file=$(mktemp)

echo "Starting blog post reorganization..."
echo "Finding files with date prefixes (YYYY-MM-DD-)..."

# Process files with date prefixes
find "$BLOG_DIR" -maxdepth 1 -type f \( -name "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md" -o -name "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.markdown" \) | sort | while read -r file; do
    filename=$(basename "$file")
    
    # Extract the year and the new filename without date prefix
    year=$(echo "$filename" | gsed -E 's/^([0-9]{4})-[0-9]{2}-[0-9]{2}-(.*)$/\1/')
    new_filename=$(echo "$filename" | gsed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-(.*)$/\1/')
    
    # Target directory and file
    target_dir="$BLOG_DIR/$year"
    target_file="$target_dir/$new_filename"
    
    # Create year folder if it doesn't exist
    if [ ! -d "$target_dir" ]; then
        echo "Creating year folder: $year"
        mkdir -p "$target_dir"
    fi
    
    # Check for conflicts
    non_dated_file="$BLOG_DIR/$new_filename"
    
    # Case 1: No conflicts - just move the file
    if [ ! -f "$non_dated_file" ] && [ ! -f "$target_file" ]; then
        echo "Moving: $filename -> $year/$new_filename" | tee -a "$report_file" "$moved_file"
        mv "$file" "$target_file"
        continue
    fi
    
    # Case 2: Conflict with non-dated file in root directory
    if [ -f "$non_dated_file" ]; then
        # Compare file sizes to determine which has more content
        dated_size=$(wc -c < "$file")
        nondated_size=$(wc -c < "$non_dated_file")
        
        if [ "$dated_size" -ge "$nondated_size" ]; then
            # Dated file has more content, keep it and move to year folder
            echo "Resolving conflict (using dated): $filename -> $year/$new_filename (removing $new_filename)" | \
                tee -a "$report_file" "$conflict_resolved_file"
            rm "$non_dated_file"
            mv "$file" "$target_file"
        else
            # Non-dated file has more content, keep it and move to year folder
            echo "Resolving conflict (using non-dated): $new_filename -> $year/$new_filename (removing $filename)" | \
                tee -a "$report_file" "$conflict_resolved_file"
            mv "$non_dated_file" "$target_file"
            rm "$file"
        fi
        continue
    fi
    
    # Case 3: File already exists in year directory
    if [ -f "$target_file" ]; then
        # Compare file sizes to determine which has more content
        dated_size=$(wc -c < "$file")
        yeardir_size=$(wc -c < "$target_file")
        
        if [ "$dated_size" -ge "$yeardir_size" ]; then
            # Dated file has more content, replace the one in year folder
            echo "Replacing duplicate in year folder: $filename -> $year/$new_filename" | \
                tee -a "$report_file" "$conflict_resolved_file"
            rm "$target_file"
            mv "$file" "$target_file"
        else
            # Year directory file has more content, just remove the dated one
            echo "Keeping existing file in year folder: $year/$new_filename (removing $filename)" | \
                tee -a "$report_file" "$conflict_resolved_file"
            rm "$file"
        fi
        continue
    fi
    
    # If we get here, something unexpected happened
    echo "SKIPPED (unexpected case): $filename" | tee -a "$report_file" "$skipped_file"
done

# Count results
moved_count=$(wc -l < "$moved_file")
conflict_count=$(wc -l < "$conflict_resolved_file")
skipped_count=$(wc -l < "$skipped_file")
total_processed=$((moved_count + conflict_count + skipped_count))

# Print summary
echo ""
echo "=== Blog Post Reorganization Summary ==="
echo "Total files processed: $total_processed"
echo "Files moved without conflicts: $moved_count"
echo "Conflicts resolved: $conflict_count"
echo "Files skipped: $skipped_count"
echo ""
echo "=== Details ==="
cat "$report_file"

# Clean up
rm "$report_file" "$moved_file" "$skipped_file" "$conflict_resolved_file"