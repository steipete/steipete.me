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
  
  // If tags is already a valid JSON array, fix any nested quotes
  if (tags.startsWith('[') && tags.endsWith(']')) {
    try {
      // Parse the JSON to check validity
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        // Fix nested quotes if present
        if (parsed.some(tag => typeof tag === 'string' && tag.startsWith('["') && tag.endsWith('"]'))) {
          return JSON.stringify(parsed.map(tag => {
            if (typeof tag === 'string' && tag.startsWith('["') && tag.endsWith('"]')) {
              try {
                return JSON.parse(tag)[0];
              } catch (e) {
                return tag;
              }
            }
            return tag;
          }));
        }
        return JSON.stringify(parsed);
      }
    } catch (e) {
      // Not valid JSON, proceed with normal conversion
    }
  }
  
  if (Array.isArray(tags)) {
    return JSON.stringify(tags);
  }
  
  return JSON.stringify(tags.split(/\s*,\s*/).map(tag => tag.trim()).filter(Boolean));
}

// Process each file
function processFile(filePath) {
  console.log(`Processing ${path.basename(filePath)}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Match the frontmatter section (between --- and ---)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`No frontmatter found in ${path.basename(filePath)}`);
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const restContent = content.slice(frontmatterMatch[0].length);
  
  // Extract fields from frontmatter
  const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?(\s*$|\n)/m);
  const dateMatch = frontmatter.match(/date:\s*(.*?)(\s*$|\n)/m);
  const pubDateMatch = frontmatter.match(/pubDate:\s*(.*?)(\s*$|\n)/m);
  const tagsMatch = frontmatter.match(/tags:\s*(.*?)(\s*$|\n)/m);
  const descriptionMatch = frontmatter.match(/description:\s*["']?(.*?)["']?(\s*$|\n)/m);
  const imageMatch = frontmatter.match(/image:\s*(.*?)(\s*$|\n)/m);
  const heroImageMatch = frontmatter.match(/heroImage:\s*(.*?)(\s*$|\n)/m);
  
  // Get values or defaults
  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const dateValue = dateMatch ? dateMatch[1].trim() : '';
  const pubDateValue = pubDateMatch ? pubDateMatch[1].trim() : dateValue;
  const tagsValue = tagsMatch ? tagsMatch[1].trim() : '';
  let descriptionValue = descriptionMatch ? descriptionMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const imageValue = imageMatch ? imageMatch[1].trim() : '';
  const heroImageValue = heroImageMatch ? heroImageMatch[1].trim() : imageValue;
  
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
  
  // Fix empty title
  if (!title.trim()) {
    const filenameTitle = path.basename(filePath, path.extname(filePath))
      .replace(/^\\d{4}-\\d{2}-\\d{2}-/, '')  // Remove date prefix
      .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    console.log(`Fixed empty title in ${path.basename(filePath)} to: ${filenameTitle}`);
  }
  
  // Create new frontmatter
  const newFrontmatter = `---
title: "${title || path.basename(filePath, path.extname(filePath))}"
pubDate: ${convertDate(pubDateValue)}
description: "${descriptionValue.replace(/"/g, '\\"')}"
${heroImageValue ? `heroImage: ${heroImageValue}` : ''}
tags: ${convertTags(tagsValue)}
---`;

  // Replace the old frontmatter with the new one
  const newContent = content.replace(/^---\n[\s\S]*?\n---/, newFrontmatter);
  
  // Check for twitter embeds and convert if needed
  const hasTwitterEmbeds = content.includes('{% twitter');
  let updatedContent = newContent;
  
  if (hasTwitterEmbeds) {
    // Replace twitter embeds with properly formatted ones
    updatedContent = updatedContent.replace(
      /{% twitter (https:\/\/twitter\.com\/.*?) %}/g, 
      '<blockquote class="twitter-tweet"><a href="$1"></a></blockquote>'
    );
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Updated ${path.basename(filePath)}`);
}

// Process all markdown files in the blog directory
fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
  .forEach(file => {
    processFile(path.join(contentDir, file));
  });

console.log('All blog posts have been cleaned up!');