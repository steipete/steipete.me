#!/usr/bin/env node

/**
 * Script to organize old article images into year folders
 * This script moves images referenced by old articles into year-based folders
 * if they're not already organized that way.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Get current script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const contentDir = path.join(__dirname, '../src/content/blog');
const publicImagesDir = path.join(__dirname, '../public/images');
const postsImageDir = path.join(publicImagesDir, 'posts');
const assetsImgDir = path.join(__dirname, '../public/assets/img');

// Create directories if they don't exist
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to extract year from filename (assumes YYYY-MM-DD-title.md format)
function extractYearFromFilename(filename) {
  const match = filename.match(/^(\d{4})-\d{2}-\d{2}/);
  if (match) {
    return match[1];
  }
  return null;
}

// Function to extract year from frontmatter date
function extractYearFromFrontmatter(data) {
  if (data.pubDate) {
    const match = data.pubDate.toString().match(/^(\d{4})/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Function to process each blog post
function processPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Get the year from the filename or frontmatter
    const fileName = path.basename(filePath);
    let year = extractYearFromFilename(fileName);
    
    if (!year) {
      year = extractYearFromFrontmatter(data);
    }
    
    if (!year) {
      console.log(`Could not determine year for ${fileName}, skipping...`);
      return;
    }
    
    // Find all image references in the content
    // Look for markdown image syntax ![alt](path) and HTML img tags
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
    const htmlImageRegex = /<img.*?src=["'](.*?)["']/g;
    
    let match;
    const imagePaths = new Set();
    
    // Find markdown images
    while ((match = markdownImageRegex.exec(content)) !== null) {
      imagePaths.add(match[1]);
    }
    
    // Find HTML images
    while ((match = htmlImageRegex.exec(content)) !== null) {
      imagePaths.add(match[1]);
    }
    
    // Check if heroImage is set in frontmatter
    if (data.heroImage) {
      imagePaths.add(data.heroImage);
    }
    
    console.log(`Found ${imagePaths.size} image references in ${fileName}`);
    
    // Process each image path
    imagePaths.forEach(imagePath => {
      // Skip external images and already organized images
      if (imagePath.startsWith('http') || 
          imagePath.includes('/assets/img/') || 
          (imagePath.includes('/images/posts/') && imagePath.includes(`/${year}/`))) {
        return;
      }
      
      // Normalize the path to get just the filename
      const normalizedPath = imagePath.replace(/^\//, '');
      let imageName = path.basename(normalizedPath);
      
      // Check in public/images/posts directory
      const oldImagePath = path.join(postsImageDir, imageName);
      if (fs.existsSync(oldImagePath)) {
        // Create year directory under assets/img if needed
        const yearDir = path.join(assetsImgDir, year);
        ensureDirExists(yearDir);
        
        // Create directory for the post (using filename without date and extension)
        const postName = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
        const postDir = path.join(yearDir, postName);
        ensureDirExists(postDir);
        
        // Create the new path for the image
        const newImagePath = path.join(postDir, imageName);
        
        // Move the image if it doesn't already exist at the destination
        if (!fs.existsSync(newImagePath)) {
          fs.copyFileSync(oldImagePath, newImagePath);
          console.log(`Moved image: ${oldImagePath} -> ${newImagePath}`);
          
          // Update the image reference in the content
          const newRelativePath = `/assets/img/${year}/${postName}/${imageName}`;
          const updatedContent = content.replace(
            new RegExp(imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
            newRelativePath
          );
          
          // Update heroImage in frontmatter if needed
          if (data.heroImage === imagePath) {
            data.heroImage = newRelativePath;
          }
          
          // Write the updated content back to the file
          fs.writeFileSync(filePath, matter.stringify(updatedContent, data));
          console.log(`Updated image references in ${fileName}`);
        }
      } else {
        console.log(`Image not found: ${oldImagePath} referenced in ${fileName}`);
      }
    });
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

// Get all markdown files in the blog directory
const files = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
  .map(file => path.join(contentDir, file));

// Process each file
console.log(`Found ${files.length} posts to process`);
files.forEach(processPost);
console.log('Done organizing images into year folders');