#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = "/Users/steipete/Projects/steipete.me/PSPDFKit-Website";
const BLOG_DIR = "/Users/steipete/Projects/steipete.me/src/content/blog/pspdfkit";
const TARGET_DIR = "/Users/steipete/Projects/steipete.me/public";

// Regular expression to find image paths in markdown files
const imagePathRegex = /!\[.*?\]\((\/images\/blog\/.*?)\)/g;

// Function to find all image references in markdown files
function findImageReferences() {
  const imageReferences = new Set();
  
  // Recursively find all .md files in the blog directory
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.md')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          let match;
          
          // Find all image references in the markdown content
          while ((match = imagePathRegex.exec(content)) !== null) {
            const imagePath = match[1];
            imageReferences.add(imagePath);
          }
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error);
        }
      }
    }
  }
  
  processDirectory(BLOG_DIR);
  return Array.from(imageReferences);
}

// Function to copy images
function copyImages(imageReferences) {
  for (const imagePath of imageReferences) {
    try {
      // Source path is relative to PSPDFKit-Website/source
      const sourcePath = path.join(SOURCE_DIR, 'source', imagePath);
      
      // Target path is relative to steipete.me/public
      // Replace /images/ with /assets/img/pspdfkit/
      const targetPath = path.join(TARGET_DIR, imagePath.replace('/images/blog/', '/assets/img/pspdfkit/'));
      
      // Create target directory if it doesn't exist
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`Created directory: ${targetDir}`);
      }
      
      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    } catch (error) {
      console.error(`Error copying image ${imagePath}:`, error);
    }
  }
}

// Function to update image paths in markdown files
function updateImagePaths() {
  // Recursively process all .md files
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.md')) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Replace image paths in the content
          const updatedContent = content.replace(
            imagePathRegex, 
            (match, imagePath) => {
              return match.replace(
                imagePath, 
                imagePath.replace('/images/blog/', '/assets/img/pspdfkit/')
              );
            }
          );
          
          // Write the updated content back to the file
          if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`Updated image paths in: ${filePath}`);
          }
        } catch (error) {
          console.error(`Error updating image paths in ${filePath}:`, error);
        }
      }
    }
  }
  
  processDirectory(BLOG_DIR);
}

// Main function
function main() {
  console.log('Finding image references...');
  const imageReferences = findImageReferences();
  console.log(`Found ${imageReferences.length} image references.`);
  
  console.log('Copying images...');
  copyImages(imageReferences);
  
  console.log('Updating image paths in markdown files...');
  updateImagePaths();
  
  console.log('Done!');
}

// Run the main function
main();