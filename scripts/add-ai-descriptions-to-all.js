#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Directory containing all blog posts
const BLOG_DIR = '/Users/steipete/Projects/steipete.me/src/content/blog';

// Process posts in a specific year directory
function processYearDirectory(yearDir) {
  console.log(`Processing posts from ${yearDir}...`);
  
  const fullYearPath = path.join(BLOG_DIR, yearDir);
  if (!fs.existsSync(fullYearPath) || !fs.statSync(fullYearPath).isDirectory()) {
    return;
  }
  
  const files = fs.readdirSync(fullYearPath)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(fullYearPath, file));
  
  console.log(`Found ${files.length} posts in ${yearDir}`);
  
  for (const file of files) {
    processFile(file);
  }
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if the file already has an AI description marker
  if (content.includes('::ai[')) {
    console.log(`  Already has AI description, skipping.`);
    return;
  }
  
  // Extract front matter
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontMatterMatch) {
    console.error(`  Could not find front matter in ${filePath}`);
    return;
  }
  
  let frontMatter = frontMatterMatch[1];
  
  // Extract description from front matter
  let description;
  const descriptionMatch = frontMatter.match(/description: ['"](.*)['"]$/m);
  
  if (descriptionMatch) {
    description = descriptionMatch[1];
  } else {
    // If no description in front matter, generate one from the first paragraph
    const mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    const firstParagraph = mainContent.split('\n\n')[0].trim();
    
    // Truncate if needed
    description = firstParagraph.length > 150 
      ? firstParagraph.substring(0, 147) + '...'
      : firstParagraph;
      
    // Add description to frontmatter
    frontMatter = frontMatter + `\ndescription: '${description}'`;
    content = content.replace(frontMatterMatch[0], `---\n${frontMatter}\n---\n`);
    
    console.log(`  Added description to front matter of ${filePath}`);
  }
  
  // Generate AI description marker
  const aiDescription = `::ai[${description}]`;
  
  // Add the AI description after the front matter
  const newContent = content.replace(/^---\n[\s\S]*?\n---\n/, `---\n${frontMatter}\n---\n\n${aiDescription}\n\n`);
  
  // Write the updated content
  fs.writeFileSync(filePath, newContent);
  console.log(`  Added AI description to ${filePath}`);
}

// Get all year directories (2012-2025)
const years = [];
for (let year = 2012; year <= 2025; year++) {
  years.push(year.toString());
}

// Process each year
for (const year of years) {
  processYearDirectory(year);
}

console.log('Done adding AI descriptions to all blog posts!');