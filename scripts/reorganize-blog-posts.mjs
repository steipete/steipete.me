#!/usr/bin/env node

/**
 * Script to reorganize blog posts into year folders with date prefixes removed
 * This is a more programmatic approach compared to the shell script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const blogDir = path.join(rootDir, 'src', 'content', 'blog');

// Ensure we're in the right place
if (!fs.existsSync(blogDir)) {
  console.error('Error: Blog directory not found. Please run from project root.');
  process.exit(1);
}

console.log('=== Blog Post Reorganization ===');
console.log('This script will reorganize blog posts into year folders with date prefixes removed.\n');

// Find all markdown files in the blog directory
const findMarkdownFiles = (dir) => {
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // If it's a directory, skip (we only want files at the top level)
      continue;
    } else if (/\.(md|mdx|markdown)$/.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
};

// Extract year from filename and create new path
const processFile = (filePath) => {
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  
  // Skip files already in year directories
  if (fileDir !== blogDir) {
    return null;
  }
  
  // Match date pattern: YYYY-MM-DD-title.ext
  const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*)/);
  if (!match) {
    return null;
  }
  
  const [, year, , , slug] = match;
  const extension = path.extname(fileName);
  const newDir = path.join(blogDir, year);
  const newPath = path.join(newDir, slug);
  
  return { oldPath: filePath, newPath, year };
};

// Execute the reorganization
const reorganizePosts = () => {
  console.log('Scanning blog posts...\n');
  const markdownFiles = findMarkdownFiles(blogDir);
  const changes = [];
  
  for (const file of markdownFiles) {
    const result = processFile(file);
    if (result) {
      changes.push(result);
    }
  }
  
  if (changes.length === 0) {
    console.log('No files need to be reorganized. All posts are already in year folders.');
    return;
  }
  
  console.log(`Found ${changes.length} posts to reorganize:`);
  changes.forEach(change => {
    console.log(`- ${path.basename(change.oldPath)} → ${path.basename(change.newPath)}`);
  });
  
  console.log('\nCreating year directories...');
  const years = [...new Set(changes.map(change => change.year))];
  years.forEach(year => {
    const yearDir = path.join(blogDir, year);
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
      console.log(`- Created directory for ${year}`);
    }
  });
  
  console.log('\nMoving files...');
  changes.forEach(change => {
    fs.renameSync(change.oldPath, change.newPath);
    console.log(`- ${path.basename(change.oldPath)} → ${path.basename(change.newPath)}`);
  });
  
  console.log('\nReorganization complete!');
  console.log(`- ${changes.length} posts reorganized into ${years.length} year folders`);
  console.log('- All date prefixes removed from filenames');
};

// Run the reorganization
reorganizePosts();