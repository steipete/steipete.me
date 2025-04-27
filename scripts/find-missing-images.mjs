#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'src', 'content', 'blog');
const publicDir = path.join(rootDir, 'public');

// Regular expressions to find image references
const imageRegexes = [
  /!\[(.*?)\]\((.*?)\)/g,            // Markdown image syntax: ![alt](url)
  /!\[(.*?)\]\[(.*?)\]/g,            // Markdown image reference syntax: ![alt][ref]
  /<img.*?src=["'](.*?)["']/g,       // HTML image syntax: <img src="url">
  /heroImage:\s*(['"]?)(.*?)\1/g     // Frontmatter heroImage
];

// Find all markdown files
const markdownFiles = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
  .map(file => path.join(contentDir, file));

console.log(`Found ${markdownFiles.length} markdown files to check`);

// Track all found image references
const imageReferences = new Set();
const missingImages = new Set();

// Process each markdown file to find image references
markdownFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  imageRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      // The image URL is in different group positions depending on the regex
      let imageUrl;
      if (regex.source.includes('heroImage')) {
        imageUrl = match[2];
      } else if (regex.source.includes('src=')) {
        imageUrl = match[1];
      } else {
        imageUrl = match[2];
      }
      
      // Skip external URLs
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        continue;
      }
      
      // Normalize the path to remove leading slash
      if (imageUrl.startsWith('/')) {
        imageUrl = imageUrl.substring(1);
      }
      
      // Skip empty or invalid paths
      if (!imageUrl) continue;
      
      const imagePath = path.join(publicDir, imageUrl);
      imageReferences.add(imageUrl);
      
      // Check if the image file exists
      if (!fs.existsSync(imagePath)) {
        missingImages.add(imageUrl);
        console.log(`Missing image in ${path.basename(filePath)}: ${imageUrl}`);
      }
    }
  });
});

console.log(`\nTotal image references found: ${imageReferences.size}`);
console.log(`Missing images: ${missingImages.size}`);

if (missingImages.size > 0) {
  console.log("\nMissing image paths:");
  missingImages.forEach(img => console.log(`- ${img}`));
}

// Create a directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

// Create directories for all missing images
console.log("\nCreating directories for missing images...");
missingImages.forEach(img => {
  const dir = path.dirname(path.join(publicDir, img));
  if (ensureDirectoryExists(dir)) {
    console.log(`Created directory: ${path.relative(rootDir, dir)}`);
  }
  
  // Create an empty placeholder file
  fs.writeFileSync(path.join(publicDir, img), '');
  console.log(`Created placeholder for: ${img}`);
});

console.log("\nDONE: Created directories and placeholders for all missing images.");
console.log("Now you need to manually copy the actual image files from the source repository.");