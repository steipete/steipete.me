#!/usr/bin/env node

/**
 * Script to add source metadata to blog posts based on their origin.
 * This helps track which website each post originally came from.
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

// Names of the original source sites
const STEIPETE_COM = 'steipete.com';
const PETERSTEINBERGER_COM = 'petersteinberger.com';

// List of known posts from petersteinberger.com
const petersteinbergerPosts = [
  'dont-call-willchangevalueforkey',
  'reboot',
  'moving-on', 
  'nsurlcache-uses-a-disk-cache-as-of-ios5',
  'pimping-recursivedescription',
  'using-subscripting-with-Xcode-4_4-and-iOS-4_3',
  'hacking-block-support-into-uimenuitem',
  'uiappearance-for-custom-views',
  'how-to-center-uiscrollview',
  'adding-keyboard-shortcuts-to-uialertview',
  'smart-proxy-delegation',
  'fixing-uisearchdisplaycontroller-on-ios-7',
  'how-to-inspect-the-view-hierarchy-of-3rd-party-apps',
  'fixing-what-apple-doesnt',
  'fixing-uitextview-on-ios-7',
  'hacking-with-aspects',
  'a-story-about-swizzling-the-right-way-and-touch-forwarding',
  'retrofitting-containsstring-on-ios-7',
  'uikit-debug-mode',
  'rotation-multiple-windows-bug',
  'researching-researchkit',
  'uitableviewcontroller-designated-initializer-woes'
];

// Function to process each blog post
function processPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Check if source is already set
    if (data.source) {
      console.log(`Source already set for ${path.basename(filePath)}: ${data.source}`);
      return;
    }
    
    // Determine source based on filename
    const fileName = path.basename(filePath, path.extname(filePath));
    
    let source;
    if (petersteinbergerPosts.includes(fileName)) {
      source = PETERSTEINBERGER_COM;
    } else {
      source = STEIPETE_COM;
    }
    
    // Add source to frontmatter
    data.source = source;
    
    // Write back to file
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`Updated ${fileName} with source: ${source}`);
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
console.log('Done adding source metadata to blog posts');