#!/usr/bin/env node

/**
 * Script to fix corrupted blog posts with missing titles and garbled descriptions
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

// Mapping of corrupted post filenames to their correct metadata
const postMetadata = {
  'apple-silicon-m1-a-developer-perspective.md': {
    title: "Apple Silicon M1: A Developer's Perspective",
    description: "The excitement around Apple's new M1 chip is everywhere. I took the plunge and bought a new MacBook Air M1 to put it to the test for development work."
  },
  'calling-super-at-runtime.md': {
    title: "Calling Super at Runtime in Swift",
    description: "While working on InterposeKit, I had a rather specific need: call the original implementation of a method without knowing its signature at compile time. This is how I solved it."
  },
  'state-of-swiftui.md': {
    title: "The State of SwiftUI",
    description: "WWDC 2020 marks the second release of SwiftUI, and it's a massive update. Let's talk about what's new, what's fixed, and what's still broken."
  },
  'zld-a-faster-linker.md': {
    title: "ZLD - A Faster Linker",
    description: "Link time is a significant part of incremental builds. The Apple linker ld is known to be quite slow. Uber's zld provides a faster alternative for debug builds."
  }
};

// Function to fix a corrupted post
function fixCorruptedPost(filename) {
  const filePath = path.join(contentDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Apply corrections from our metadata mapping
    if (postMetadata[filename]) {
      const corrections = postMetadata[filename];
      let modified = false;
      
      if (!data.title || data.title.includes('�') || data.title === '') {
        data.title = corrections.title;
        modified = true;
      }
      
      if (!data.description || data.description.includes('�') || data.description === '') {
        data.description = corrections.description;
        modified = true;
      }
      
      if (modified) {
        console.log(`Fixing metadata for ${filename}`);
        const updatedContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedContent);
      } else {
        console.log(`No issues found in ${filename}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Fix the known corrupted posts
Object.keys(postMetadata).forEach(fixCorruptedPost);
console.log('Done fixing corrupted posts');