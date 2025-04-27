#!/usr/bin/env node

/**
 * Script to restore tags to markdown files that were mistakenly removed
 * This script reads the content of each blog post and analyzes it to determine appropriate tags
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

// Define common tags and their related keywords
const tagKeywords = {
  'iOS': ['iOS', 'iPhone', 'iPad', 'UIKit', 'Swift', 'Objective-C', 'SwiftUI', 'Core Data'],
  'macOS': ['macOS', 'Mac', 'Catalyst', 'AppKit', 'macOS Catalina', 'macOS Big Sur', 'Hackintosh'],
  'Swift': ['Swift', 'SwiftUI', 'Swift Package Manager', 'Swift Trunk'],
  'Objective-C': ['Objective-C', 'Objective C', 'ObjC', 'Runtime', 'Swizzling', 'Method Swizzling'],
  'UIKit': ['UIKit', 'UIView', 'UIViewController', 'UILabel', 'UIButton', 'UITableView'],
  'SwiftUI': ['SwiftUI', 'View', 'State', 'Binding', 'ObservableObject'],
  'Debugging': ['Debug', 'Debugging', 'LLDB', 'GDB', 'Instruments', 'Crash', 'Core Dump'],
  'Performance': ['Performance', 'Optimization', 'Speed', 'Efficiency'],
  'Xcode': ['Xcode', 'Interface Builder', 'Swift Compiler', 'Build System'],
  'AppKit': ['AppKit', 'NSView', 'NSWindow', 'NSApplication'],
  'Catalyst': ['Catalyst', 'Mac Catalyst', 'UIKit for Mac'],
  'Jailbreaking': ['Jailbreak', 'Jailbreaking', 'Tweak', 'Cydia'],
  'Apple Silicon': ['Apple Silicon', 'M1', 'ARM', 'arm64'],
  'Kernel': ['Kernel', 'Kernel Panic', 'kext', 'boot-args'],
  'Hacking': ['Hack', 'Hacking', 'Reverse Engineering', 'Disassembly']
};

// Function to detect likely tags based on content
function detectTags(title, content) {
  const combinedText = `${title} ${content}`.toLowerCase();
  const detectedTags = new Set();
  
  // Check for each tag's keywords
  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        detectedTags.add(tag);
        break;
      }
    }
  });
  
  return Array.from(detectedTags);
}

// Function to process each blog post
function processPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Skip if tags already exist
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      console.log(`Tags already exist for ${path.basename(filePath)}`);
      return;
    }
    
    // Detect appropriate tags
    const title = data.title || '';
    const detectedTags = detectTags(title, content);
    
    if (detectedTags.length === 0) {
      console.log(`No tags detected for ${path.basename(filePath)}`);
      return;
    }
    
    // Add tags to frontmatter
    data.tags = detectedTags;
    
    // Write back to file
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`Added tags to ${path.basename(filePath)}: ${detectedTags.join(', ')}`);
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
console.log('Done restoring tags to blog posts');