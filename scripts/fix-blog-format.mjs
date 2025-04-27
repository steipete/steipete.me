#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Function to convert date format
function convertDate(dateStr) {
  // Just in case dates are already ISO format
  if (dateStr.includes('T')) return dateStr;
  
  // Parse the date string
  const match = dateStr.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([+-]\d{4})/);
  if (!match) return dateStr;
  
  const [, date, time, timezone] = match;
  const timezoneFormatted = timezone.replace(/([+-])(\d{2})(\d{2})/, '$1$2:$3');
  return `${date}T${time}${timezoneFormatted}`;
}

// Function to convert tags
function convertTags(tags) {
  if (!tags) return '[]';
  if (Array.isArray(tags)) {
    return JSON.stringify(tags);
  }
  
  return JSON.stringify(tags.split(/\s+/).map(tag => tag.trim()).filter(Boolean));
}

// Process each file
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Match the frontmatter section (between --- and ---)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`No frontmatter found in ${filePath}`);
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const restContent = content.slice(frontmatterMatch[0].length);
  
  // Extract fields from frontmatter
  const titleMatch = frontmatter.match(/title:\s*"(.*?)"/);
  const dateMatch = frontmatter.match(/date:\s*(.*)/);
  const pubDateMatch = frontmatter.match(/pubDate:\s*(.*)/);
  const tagsMatch = frontmatter.match(/tags:\s*(.*)/);
  const descriptionMatch = frontmatter.match(/description:\s*"(.*?)"/);
  const imageMatch = frontmatter.match(/image:\s*(.*)/);
  const heroImageMatch = frontmatter.match(/heroImage:\s*(.*)/);
  
  const title = titleMatch ? titleMatch[1] : '';
  const dateValue = dateMatch ? dateMatch[1] : '';
  const pubDateValue = pubDateMatch ? pubDateMatch[1] : dateValue;
  const tagsValue = tagsMatch ? tagsMatch[1] : '';
  let descriptionValue = descriptionMatch ? descriptionMatch[1] : '';
  const imageValue = imageMatch ? imageMatch[1] : '';
  const heroImageValue = heroImageMatch ? heroImageMatch[1] : imageValue;
  
  // Generate description if missing
  if (!descriptionValue) {
    // Extract first paragraph of content (up to 160 chars)
    const firstParagraphMatch = restContent.trim().match(/(.*?[.!?])\s/);
    if (firstParagraphMatch) {
      descriptionValue = firstParagraphMatch[1].replace(/[\\n\\r#*_"`]/g, '').trim();
      if (descriptionValue.length > 160) {
        descriptionValue = descriptionValue.substring(0, 157) + '...';
      }
    } else {
      descriptionValue = `Article about ${title}`;
    }
  }
  
  // Create new frontmatter
  const newFrontmatter = `---
title: "${title}"
pubDate: ${convertDate(pubDateValue)}
description: "${descriptionValue.replace(/"/g, '\\"')}"
${heroImageValue ? `heroImage: ${heroImageValue}` : ''}
tags: ${convertTags(tagsValue)}
---`;

  // Replace the old frontmatter with the new one
  const newContent = content.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated ${filePath}`);
}

// Process all markdown files in the blog directory
fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
  .forEach(file => {
    processFile(path.join(contentDir, file));
  });

console.log('All blog posts have been updated!');