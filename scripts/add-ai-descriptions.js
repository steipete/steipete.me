#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get all the migrated blog posts
const yearDirs = [2015, 2016, 2017, 2018, 2019].map(year => `/Users/steipete/Projects/steipete.me/src/content/blog/${year}`);

// Process all posts in each year directory
for (const yearDir of yearDirs) {
  if (!fs.existsSync(yearDir)) {
    console.log(`Directory does not exist: ${yearDir}`);
    continue;
  }

  const files = fs.readdirSync(yearDir).filter(file => file.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(yearDir, file);
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if the file already has an AI description marker
    if (content.includes('::ai[')) {
      console.log(`  Already has AI description, skipping.`);
      continue;
    }
    
    // Extract front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontMatterMatch) {
      console.error(`  Could not find front matter in ${filePath}`);
      continue;
    }
    
    const frontMatter = frontMatterMatch[1];
    const descriptionMatch = frontMatter.match(/description: ['"](.*)['"]$/m);
    
    if (!descriptionMatch) {
      console.error(`  Could not find description in ${filePath}`);
      continue;
    }
    
    const description = descriptionMatch[1];
    
    // Extract the main content (after front matter)
    const mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Generate AI description marker
    const aiDescription = `::ai[${description}]`;
    
    // Add the AI description after the front matter
    const newContent = content.replace(/^---\n[\s\S]*?\n---\n/, `---\n${frontMatter}\n---\n\n${aiDescription}\n\n`);
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent);
    console.log(`  Added AI description to ${filePath}`);
  }
}

console.log('Done adding AI descriptions!');