#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the file to migrate from command line argument
const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a file path to migrate');
  process.exit(1);
}

// Read the file
const content = fs.readFileSync(filePath, 'utf8');

// Extract front matter
const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontMatterMatch) {
  console.error('Could not find front matter in the file');
  process.exit(1);
}

const frontMatter = frontMatterMatch[1];

// Extract needed metadata
const titleMatch = frontMatter.match(/title: "(.*?)"/);
const dateMatch = frontMatter.match(/date: (.*)/);
const tagsMatch = frontMatter.match(/tags: (.*)/);

if (!titleMatch || !dateMatch) {
  console.error('Could not find required metadata in front matter');
  process.exit(1);
}

const title = titleMatch[1];
const date = new Date(dateMatch[1]);
let tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : ['iOS', 'Development'];

// Ensure tags are formatted as an array
const formattedTags = tags.map(tag => `  - ${tag}`).join('\n');

// Extract the main content (strip READMORE marker if present)
let mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
mainContent = mainContent.replace('READMORE\n\n', '');

// Generate AI description (first paragraph, truncated)
let description = mainContent.split('\n\n')[0].trim();
if (description.length > 150) {
  description = description.substring(0, 147) + '...';
}

// Create new front matter
const newFrontMatter = `---
title: '${title}'
pubDate: ${date.toISOString()}
description: '${description}'
tags:
${formattedTags}
source: pspdfkit.com
---

::ai[${description}]

`;

// Combine to create the new content
const newContent = newFrontMatter + mainContent;

// Determine the target directory based on the date
const year = date.getFullYear();
const targetDir = path.join('/Users/steipete/Projects/steipete.me/src/content/blog', year.toString());

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create the filename (remove .html from the original filename)
const originalFilename = path.basename(filePath);
const newFilename = originalFilename.replace('.html.md', '.md');
const targetPath = path.join(targetDir, newFilename);

// Write the new file
fs.writeFileSync(targetPath, newContent);

// Handle images
// Extract image paths
const imageRegex = /!\[.*?\]\((\/images\/blog\/.*?)\)/g;
let imageMatch;
const imagePaths = [];

while ((imageMatch = imageRegex.exec(content)) !== null) {
  imagePaths.push(imageMatch[1]);
}

// Create the corresponding images directory
const imagesDir = path.join('/Users/steipete/Projects/steipete.me/public/assets/img', year.toString(), path.basename(newFilename, '.md'));
if (imagePaths.length > 0 && !fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy images and update paths in the content
let updatedContent = newContent;
for (const imagePath of imagePaths) {
  const sourceImage = path.join('/Users/steipete/Projects/steipete.me/public/assets/img/pspdfkit', imagePath.replace('/images/blog/', ''));
  const imageName = path.basename(imagePath);
  const targetImage = path.join(imagesDir, imageName);
  
  // Check if source image exists
  if (fs.existsSync(sourceImage)) {
    // Copy the image
    fs.copyFileSync(sourceImage, targetImage);
    
    // Update the path in the content
    const newImagePath = `/assets/img/${year}/${path.basename(newFilename, '.md')}/${imageName}`;
    updatedContent = updatedContent.replace(imagePath, newImagePath);
  } else {
    console.warn(`Warning: Image not found: ${sourceImage}`);
  }
}

// Write the updated content with fixed image paths
fs.writeFileSync(targetPath, updatedContent);

console.log(`Successfully migrated ${filePath} to ${targetPath}`);
if (imagePaths.length > 0) {
  console.log(`Copied ${imagePaths.length} images to ${imagesDir}`);
}