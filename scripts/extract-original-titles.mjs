#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

// Paths to the original repositories
const steipeteComPath = path.join(process.cwd(), 'temp-repos/steipete.com/_posts');
const petersteinbergerComPath = path.join(process.cwd(), 'temp-repos/petersteinberger.com/source/_posts');

// Get all blog posts from the original repos
const steipeteComPosts = globSync('**/*.md', { cwd: steipeteComPath });
const petersteinbergerComPosts = globSync('**/*.markdown', { cwd: petersteinbergerComPath });

console.log(`Found ${steipeteComPosts.length} posts in steipete.com`);
console.log(`Found ${petersteinbergerComPosts.length} posts in petersteinberger.com`);

// Map to store original titles
const originalTitles = {};

// Extract titles from steipete.com posts
steipeteComPosts.forEach((file) => {
  const filePath = path.join(steipeteComPath, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { data } = matter(fileContent);
    if (data.title && data.title.trim() !== '') {
      // Convert filename to match our blog structure
      const baseName = file.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      originalTitles[baseName] = data.title;
    }
  } catch (error) {
    console.error(`Error parsing ${file}:`, error.message);
  }
});

// Extract titles from petersteinberger.com posts
petersteinbergerComPosts.forEach((file) => {
  const filePath = path.join(petersteinbergerComPath, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { data } = matter(fileContent);
    if (data.title && data.title.trim() !== '') {
      // Convert filename to match our blog structure
      const baseName = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.markdown$/, '.md');
      originalTitles[baseName] = data.title;
    }
  } catch (error) {
    console.error(`Error parsing ${file}:`, error.message);
  }
});

console.log(`Extracted ${Object.keys(originalTitles).length} original titles`);

// Now update our blog posts with the original titles
const blogDir = path.join(process.cwd(), 'src/content/blog');
const blogFiles = globSync('**/*.{md,mdx}', { cwd: blogDir });

console.log(`Found ${blogFiles.length} blog posts in our site. Updating titles...`);

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

// Update each file
blogFiles.forEach((file) => {
  const filePath = path.join(blogDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { data, content } = matter(fileContent);
    
    // Get the basename of the file
    const baseName = path.basename(file);
    
    // If we have an original title, update it
    if (originalTitles[baseName]) {
      const originalTitle = originalTitles[baseName];
      
      // Only update if the title is different
      if (data.title !== originalTitle) {
        console.log(`Updating title for ${file}:\n  - Current: "${data.title}"\n  - Original: "${originalTitle}"`);
        
        // Update frontmatter with original title
        const updatedFrontmatter = matter.stringify(content, {
          ...data,
          title: originalTitle
        });
        
        // Write updated content back to file
        fs.writeFileSync(filePath, updatedFrontmatter);
        updatedCount++;
      } else {
        console.log(`Skipping ${file} - title already matches original`);
        skippedCount++;
      }
    } else {
      console.log(`Original title not found for ${file}`);
      skippedCount++;
    }
    
  } catch (error) {
    console.error(`Error updating ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\nSummary:');
console.log(`✅ Posts updated with original titles: ${updatedCount}`);
console.log(`⏭️ Posts skipped: ${skippedCount}`);
console.log(`❌ Errors: ${errorCount}`);

// Save the mapping of original titles to a JSON file for reference
fs.writeFileSync(
  path.join(process.cwd(), 'scripts/original-titles-mapping.json'), 
  JSON.stringify(originalTitles, null, 2)
);