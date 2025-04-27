#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find all Markdown files in a directory recursively
function findMarkdownFiles(directory) {
  const results = [];
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findMarkdownFiles(filePath));
    } else if (file.endsWith('.md') || file.endsWith('.markdown')) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to check if a file contains the old AI description format
function hasOldAIFormat(content) {
  return content.includes('::ai[');
}

// Function to convert old AI description format to new format
function convertAIDescription(filePath) {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // If file doesn't have old AI format, skip it
    if (!hasOldAIFormat(fileContent)) {
      return false;
    }
    
    // Extract metadata and content
    const { data, content } = matter(fileContent);
    
    // Extract the AI description from the ::ai[...] syntax
    // Updated regex to find ::ai[] anywhere in the content
    const aiMatch = content.match(/::ai\[(.*?)\]/s);
    if (!aiMatch) {
      return false;
    }
    
    const aiDescription = aiMatch[1].trim();
    
    // Add AIDescription: true to frontmatter
    data.AIDescription = true;
    
    // Set or update the description in frontmatter
    if (!data.description || typeof data.description !== 'string' || 
        data.description.length < aiDescription.length) {
      data.description = aiDescription;
    }
    
    // Remove the ::ai[...] line from content
    // Create a new regex that will capture the whole line containing ::ai[...]
    const lineRegex = new RegExp(`[^\\n]*::ai\\[${escapeRegExp(aiDescription)}\\][^\\n]*\\n?`, 'g');
    const newContent = content.replace(lineRegex, '');
    
    // Reconstruct the file with updated frontmatter
    const updatedFileContent = matter.stringify(newContent, data);
    
    // Write back to file
    fs.writeFileSync(filePath, updatedFileContent);
    
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Helper function to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Main function
function main() {
  const rootDir = path.resolve(__dirname, '..');
  const blogDir = path.join(rootDir, 'src', 'content', 'blog');
  const markdownFiles = findMarkdownFiles(blogDir);
  
  let convertedCount = 0;
  
  for (const file of markdownFiles) {
    if (convertAIDescription(file)) {
      convertedCount++;
      console.log(`Converted: ${file}`);
    }
  }
  
  console.log(`\nConversion complete. ${convertedCount} files were converted.`);
}

main();