#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

// Get all blog post files
const blogDir = path.join(process.cwd(), 'src/content/blog');
const blogFiles = globSync('**/*.{md,mdx}', { cwd: blogDir });

console.log(`Found ${blogFiles.length} blog posts. Checking for titles...`);

let missingTitles = [];
let postsWithTitles = 0;

// Check each file for a title in frontmatter
blogFiles.forEach((file) => {
  const filePath = path.join(blogDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { data } = matter(fileContent);
    
    if (!data.title || data.title.trim() === '') {
      missingTitles.push(file);
      console.log(`❌ Missing title: ${file}`);
    } else {
      postsWithTitles++;
    }
  } catch (error) {
    console.error(`Error parsing frontmatter in ${file}:`, error.message);
    missingTitles.push(`${file} (parse error)`);
  }
});

console.log('\nSummary:');
console.log(`✅ Posts with titles: ${postsWithTitles}`);
console.log(`❌ Posts without titles: ${missingTitles.length}`);

if (missingTitles.length > 0) {
  console.log('\nFiles missing titles:');
  missingTitles.forEach((file) => console.log(`- ${file}`));
}