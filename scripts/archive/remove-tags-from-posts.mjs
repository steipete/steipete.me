#!/usr/bin/env node

/**
 * Script to remove tags from all blog posts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Get current script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to blog content directory
const contentDir = path.join(__dirname, '../src/content/blog');

// Function to process each blog post
function processPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Check if tags exist
    if (!data.tags) {
      console.log(`No tags to remove for ${path.basename(filePath)}`);
      return;
    }
    
    // Remove tags
    delete data.tags;
    
    // Write back to file
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`Removed tags from ${path.basename(filePath)}`);
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
console.log('Done removing tags from blog posts');