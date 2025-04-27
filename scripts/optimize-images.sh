#!/bin/bash

# Script to optimize images using ImageOptim-CLI or by giving instructions
# This runs on macOS and assumes ImageOptim is installed

echo "Image optimization script"

# Check if ImageOptim-CLI is installed
if command -v imageoptim &> /dev/null; then
    echo "Using ImageOptim-CLI to optimize images..."
    
    # Optimize images in the public directory
    imageoptim --image-alpha --jpegmini --quality 85 --quit "/Users/steipete/Projects/steipete-astro/public/assets/img/"
    
    echo "Image optimization complete!"
else
    echo "ImageOptim-CLI not found. To optimize images, you can:"
    echo "1. Install ImageOptim-CLI: npm install -g imageoptim-cli"
    echo "2. Or use the ImageOptim app manually: https://imageoptim.com/mac"
    echo "3. Open the ImageOptim app and drag the /public/assets/img folder into it"
    
    # Create a simple AppleScript to open ImageOptim with the correct folder
    cat > /tmp/open-imageoptim.applescript << EOL
tell application "Finder"
    open POSIX file "/Users/steipete/Projects/steipete-astro/public/assets/img"
end tell

tell application "ImageOptim" to activate
EOL

    echo "Would you like to open the image folder in Finder? (y/n)"
    read -r choice
    
    if [[ $choice == "y" || $choice == "Y" ]]; then
        osascript /tmp/open-imageoptim.applescript
        echo "Folder opened in Finder. Please drag images to ImageOptim app."
    fi
fi