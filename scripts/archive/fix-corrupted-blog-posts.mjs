#!/usr/bin/env node

/**
 * Script to fix corrupted blog posts - restore missing titles and fix corrupted descriptions
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

// Mapping of file names to their correct titles and descriptions
const postMetadata = {
  'apple-silicon-m1-a-developer-perspective.md': {
    title: "Apple Silicon M1: A Developer's Perspective",
    description: "The excitement around Apple's new M1 chip is everywhere. I bought a MacBook Air 16&nbsp;GB M1 to see how viable it is as a main development machine."
  },
  'calling-super-at-runtime.md': {
    title: "Calling Super at Runtime in Swift",
    description: "While working on InterposeKit, I had a rather specific need: Create an implementation that simply calls super, but at runtime instead of at compile time."
  },
  'state-of-swiftui.md': {
    title: "The State of SwiftUI",
    description: "Let's look at SwiftUI in iOS 14 and macOS Big Sur by evaluating Apple's Fruta sample app."
  },
  'zld-a-faster-linker.md': {
    title: "zld — A Faster Version of Apple's Linker",
    description: "zld is a drop-in replacement of Apple's linker that uses optimized data structures and parallelizing to speed things up."
  }
};

// Function to process each blog post
function fixBlogPost(filePath) {
  const fileName = path.basename(filePath);
  
  // Skip if we don't have a fix for this file
  if (!postMetadata[fileName] && !fileName.match(/^20\d\d-/)) {
    return;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    let modified = false;
    
    // Check for direct metadata match
    if (postMetadata[fileName]) {
      // Fix title if it's empty or missing
      if (!data.title || data.title === '') {
        data.title = postMetadata[fileName].title;
        modified = true;
        console.log(`Fixed title for ${fileName}`);
      }
      
      // Fix description if it appears corrupted
      if (data.description && (
          data.description.includes('elease') || 
          data.description.includes('dop-i') ||
          data.description.includes('woki') ||
          data.description.includes('aoud') ||
          data.description.includes(' ew ') ||
          data.description.indexOf('[') === 0)
      ) {
        data.description = postMetadata[fileName].description;
        modified = true;
        console.log(`Fixed description for ${fileName}`);
      }
    }
    
    // Check for date-based file names that might need title from the basename
    // Format: 2020-05-14-lets-try-this-again.md → "Let's Try This Again"
    if (fileName.match(/^20\d\d-\d\d-\d\d-(.+)\.md/)) {
      if (!data.title || data.title === '') {
        // Convert slug to title: my-post-title → My Post Title
        let baseName = fileName.replace(/^20\d\d-\d\d-\d\d-(.+)\.md/, '$1');
        let title = baseName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        data.title = title;
        modified = true;
        console.log(`Generated title for ${fileName}: ${title}`);
      }
    }
    
    // Write the file back only if we modified something
    if (modified) {
      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Saved fixes for ${fileName}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

// Get all markdown files in the blog directory
const files = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
  .map(file => path.join(contentDir, file));

// Process each file
console.log(`Checking ${files.length} blog posts for corruption...`);
files.forEach(fixBlogPost);
console.log('Done fixing corrupted blog posts');