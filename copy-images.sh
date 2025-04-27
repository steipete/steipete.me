#!/bin/bash

# Set source and destination base directories
SRC_DIR="/Users/steipete/Projects/steipete-astro/temp-repos"
DEST_DIR="/Users/steipete/Projects/steipete-astro/public"

# Create an array of image paths we need to find
declare -a IMAGES=(
  "/assets/img/2020/appleintelframebuffer/feedback.png"
  "/assets/img/2020/appleintelframebuffer/lg-box.jpg"
  "/assets/img/2020/catalyst-crash-fix/RTIInputSystemSession-documentState.png"
  "/assets/img/2020/uihostingcontroller-keyboard/header.png"
  "/assets/img/2020/zld/benchmarks.png"
  "/assets/img/2020/mac-idiom-forbidden-controls/mac-idiom-selector.png"
  "/assets/img/2020/swift-logging/logd.jpeg"
  "/assets/img/2020/lldb-debugging/xcode-lldb.png"
  "/assets/img/2020/calling-super/Xcode-debug.png"
  "/assets/img/2020/swift-trunk/swift-trunk.png"
  "/assets/img/2020/hackintosh/opencore-config.png"
  "/assets/img/2020/fruta-swiftui/fruta-crash.png"
  "/assets/img/2021/tap-longpress-button-swiftui/header.gif"
)

# Arrays to track results
FOUND=()
NOT_FOUND=()

# Process each image
for IMG_PATH in "${IMAGES[@]}"; do
  echo "Looking for: $IMG_PATH"
  
  # Create the destination directory if it doesn't exist
  DEST_SUBDIR="$(dirname "$DEST_DIR$IMG_PATH")"
  mkdir -p "$DEST_SUBDIR"
  
  # Find the file in the source directory
  FOUND_FILE=$(find "$SRC_DIR" -path "*$IMG_PATH" -type f -print -quit)
  
  if [ -n "$FOUND_FILE" ]; then
    # Copy file to destination
    cp -v "$FOUND_FILE" "$DEST_DIR$IMG_PATH"
    FOUND+=("$IMG_PATH")
  else
    echo "WARNING: Could not find $IMG_PATH"
    NOT_FOUND+=("$IMG_PATH")
  fi
done

# Print summary
echo "========== SUMMARY =========="
echo "Successfully copied ${#FOUND[@]} files:"
for file in "${FOUND[@]}"; do
  echo "  ✓ $file"
done

echo ""
echo "Could not find ${#NOT_FOUND[@]} files:"
for file in "${NOT_FOUND[@]}"; do
  echo "  ✗ $file"
done

# Write missing files to a text file
echo "${NOT_FOUND[@]}" > "/Users/steipete/Projects/steipete-astro/missing-images.txt"
echo ""
echo "Missing files list written to: /Users/steipete/Projects/steipete-astro/missing-images.txt"