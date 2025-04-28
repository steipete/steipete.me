#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = "/Users/steipete/Projects/steipete.me/PSPDFKit-Website/source/blog";
const TARGET_DIR = "/Users/steipete/Projects/steipete.me/src/content/blog/pspdfkit";
const AUTHOR_NAME = "Peter Steinberger";

// Create target directory if it doesn't exist
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`Created target directory: ${TARGET_DIR}`);
}

// Function to check if a blog post is authored by the specified author
function isAuthoredBy(filePath, authorName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(`author: ${authorName}`) || 
           content.includes(`author: "${authorName}"`) || 
           content.includes(`author: '${authorName}'`);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

// Function to create a year-based folder structure
function createYearFolder(date) {
  const year = date.getFullYear();
  const yearDir = path.join(TARGET_DIR, year.toString());
  
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }
  
  return yearDir;
}

// Function to process a single blog post
function processBlogPost(sourceFilePath) {
  try {
    const content = fs.readFileSync(sourceFilePath, 'utf8');
    
    // Extract metadata
    const titleMatch = content.match(/title:\s*["']?(.*?)["']?\s*$/m);
    const dateMatch = content.match(/date:\s*["']?(.*?)["']?\s*$/m);
    
    if (!titleMatch || !dateMatch) {
      console.error(`Could not extract title or date from ${sourceFilePath}`);
      return;
    }
    
    const title = titleMatch[1];
    const date = new Date(dateMatch[1]);
    
    // Generate slug from the original filename
    const sourceFileName = path.basename(sourceFilePath, '.html.md');
    
    // Create the year folder
    const yearDir = createYearFolder(date);
    
    // Target file path
    const targetFilePath = path.join(yearDir, `${sourceFileName}.md`);
    
    // Extract first paragraph for AI description
    let firstParagraph = '';
    const contentWithoutFrontmatter = content.split(/---\s*\n/g)[2] || '';
    const paragraphs = contentWithoutFrontmatter.split(/\n\n+/);
    
    // Find the first non-empty paragraph that's not an HTML comment or tag
    for (const para of paragraphs) {
      const cleanPara = para.trim();
      if (cleanPara && !cleanPara.startsWith('<!--') && !cleanPara.startsWith('<') && !cleanPara.match(/^#+\s/)) {
        firstParagraph = cleanPara.replace(/\n/g, ' ');
        break;
      }
    }
    
    // Clean up the first paragraph (remove markdown formatting)
    firstParagraph = firstParagraph
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .replace(/`([^`]+)`/g, '$1')             // Remove code formatting
      .replace(/\*\*([^*]+)\*\*/g, '$1')       // Remove bold formatting
      .replace(/\*([^*]+)\*/g, '$1')           // Remove italic formatting
      .replace(/\n/g, ' ')                     // Replace newlines with spaces
      .trim();
    
    // Create new frontmatter with AI description
    const newFrontMatter = `---
title: ${JSON.stringify(title)}
pubDate: ${date.toISOString()}
description: ${JSON.stringify(firstParagraph)}
tags:
  - pspdfkit
source: pspdfkit.com
---

::ai[${firstParagraph}]

`;
    
    // Replace front matter and write to the new file
    const newContent = newFrontMatter + contentWithoutFrontmatter;
    fs.writeFileSync(targetFilePath, newContent);
    
    console.log(`Processed: ${targetFilePath}`);
    return targetFilePath;
  } catch (error) {
    console.error(`Error processing file ${sourceFilePath}:`, error);
  }
}

// Main function to find and process all blog posts by the author
function main() {
  let count = 0;
  
  // Recursively find all .html.md files
  function findAndProcessFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findAndProcessFiles(filePath);
      } else if (file.endsWith('.html.md')) {
        if (isAuthoredBy(filePath, AUTHOR_NAME)) {
          processBlogPost(filePath);
          count++;
        }
      }
    }
  }
  
  console.log(`Searching for blog posts by ${AUTHOR_NAME}...`);
  findAndProcessFiles(SOURCE_DIR);
  console.log(`Processed ${count} blog posts by ${AUTHOR_NAME}.`);
}

// Run the main function
main();