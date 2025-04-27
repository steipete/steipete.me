#!/usr/bin/env node

/**
 * Script to organize old images into year-based folders
 * This moves images referenced by old blog posts into year-based folders
 * if they're not already organized that way
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get current script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to blog content directory and image directories
const contentDir = path.join(__dirname, '../src/content/blog');
const publicDir = path.join(__dirname, '../public');
const oldImagesPath = path.join(publicDir, 'images/posts');
const newImagesBasePath = path.join(publicDir, 'assets/img');

// Function to extract year from filename (e.g., "2020-12-25-my-post.md" → "2020")
function extractYearFromFilename(filename) {
  const match = filename.match(/^(\d{4})-/);
  return match ? match[1] : null;
}

// Function to extract year from frontmatter date
function extractYearFromDate(date) {
  if (!date) return null;
  const dateObj = new Date(date);
  return dateObj.getFullYear().toString();
}

// Function to process a single post
function processPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Get the year from the filename or frontmatter
    const fileName = path.basename(filePath);
    let year = extractYearFromFilename(fileName);
    
    // If year not in filename, try to get from frontmatter
    if (!year && data.pubDate) {
      year = extractYearFromDate(data.pubDate);
    }
    
    if (!year) {
      console.log(`Could not determine year for ${fileName}, skipping`);
      return;
    }
    
    // Create year directory if it doesn't exist
    const yearDir = path.join(newImagesBasePath, year);
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }
    
    // Look for image references in the content
    const imgRegex = /!\[.*?\]\((\/images\/posts\/[^)]+)\)/g;
    let match;
    let modified = false;
    let newContent = content;
    
    while ((match = imgRegex.exec(content)) !== null) {
      const imgPath = match[1];
      const imgName = path.basename(imgPath);
      const oldFullPath = path.join(publicDir, imgPath.substring(1));
      const newRelativePath = `/assets/img/${year}/${imgName}`;
      const newFullPath = path.join(publicDir, newRelativePath.substring(1));
      
      // Check if the old image exists
      if (fs.existsSync(oldFullPath)) {
        // Only copy if the new file doesn't exist
        if (!fs.existsSync(newFullPath)) {
          // Create the directory structure if it doesn't exist
          const newDir = path.dirname(newFullPath);
          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
          }
          
          // Copy the file to the new location
          fs.copyFileSync(oldFullPath, newFullPath);
          console.log(`Copied ${imgPath} to ${newRelativePath}`);
        } else {
          console.log(`Image already exists at ${newRelativePath}, skipping copy`);
        }
        
        // Update the image reference in the content
        newContent = newContent.replace(imgPath, newRelativePath);
        modified = true;
      } else {
        console.log(`WARNING: Image not found: ${oldFullPath}`);
      }
    }
    
    // Update heroImage in frontmatter if it points to the old location
    if (data.heroImage && data.heroImage.startsWith('/images/posts/')) {
      const imgName = path.basename(data.heroImage);
      const oldFullPath = path.join(publicDir, data.heroImage.substring(1));
      const newRelativePath = `/assets/img/${year}/${imgName}`;
      const newFullPath = path.join(publicDir, newRelativePath.substring(1));
      
      if (fs.existsSync(oldFullPath)) {
        // Only copy if the new file doesn't exist
        if (!fs.existsSync(newFullPath)) {
          // Create the directory structure if it doesn't exist
          const newDir = path.dirname(newFullPath);
          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
          }
          
          // Copy the file to the new location
          fs.copyFileSync(oldFullPath, newFullPath);
          console.log(`Copied heroImage ${data.heroImage} to ${newRelativePath}`);
        }
        
        // Update the heroImage in frontmatter
        data.heroImage = newRelativePath;
        modified = true;
      } else {
        console.log(`WARNING: HeroImage not found: ${oldFullPath}`);
      }
    }
    
    // Write the updated content and frontmatter back to the file
    if (modified) {
      const updatedContent = matter.stringify(newContent, data);
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated image paths in ${fileName}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Check if the old images directory exists
if (!fs.existsSync(oldImagesPath)) {
  console.log(`Old images directory not found: ${oldImagesPath}`);
  process.exit(1);
}

// Ensure the new images base directory exists
if (!fs.existsSync(newImagesBasePath)) {
  fs.mkdirSync(newImagesBasePath, { recursive: true });
}

// Process all markdown files
const markdownFiles = globSync(`${contentDir}/**/*.{md,mdx}`);
console.log(`Found ${markdownFiles.length} markdown files to process`);

markdownFiles.forEach(processPost);
console.log('Done organizing images');