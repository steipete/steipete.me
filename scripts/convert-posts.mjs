#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Source and target directories
const sourceDir = path.join(projectRoot, 'src', 'content', 'blog-import');
const targetDir = path.join(projectRoot, 'src', 'content', 'blog');

// Make sure the target directory exists
await fs.mkdir(targetDir, { recursive: true });

// Helper function to convert a file
async function convertFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`Converting ${fileName}...`);
  
  // Read file content
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Split by frontmatter separator
  const parts = content.split(/---\s*\n/);
  
  if (parts.length < 3) {
    console.warn(`Skipping ${fileName}: Invalid format (missing frontmatter)`);
    return;
  }
  
  // Extract frontmatter and content
  let frontmatter = parts[1];
  let postContent = parts.slice(2).join('---\n').trim();
  
  // Process frontmatter
  const frontmatterLines = frontmatter.split('\n').filter(line => line.trim() !== '');
  const processedFrontmatter = [];
  let title = '';
  let pubDate = '';
  let description = '';
  let heroImage = '';
  
  // Helper function to clean and quote string values properly
  function cleanAndQuote(value) {
    if (!value) return '';
    
    // Remove existing quotes first
    let cleaned = value.trim().replace(/^["']|["']$/g, '');
    
    // Escape single quotes
    cleaned = cleaned.replace(/'/g, "\\'");
    
    return `"${cleaned}"`;
  }
  
  // Process each line in the frontmatter
  frontmatterLines.forEach(line => {
    // Extract title
    if (line.startsWith('title:')) {
      const titleMatch = line.match(/title:\s*(.+)$/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
        processedFrontmatter.push(`title: ${cleanAndQuote(title)}`);
      }
    } 
    // Extract date and convert to pubDate
    else if (line.startsWith('date:')) {
      const dateMatch = line.match(/date:\s*(.+)$/);
      if (dateMatch && dateMatch[1]) {
        pubDate = dateMatch[1].trim();
        processedFrontmatter.push(`pubDate: "${pubDate}"`);
      }
    }
    // Extract existing pubDate if available
    else if (line.startsWith('pubDate:')) {
      const dateMatch = line.match(/pubDate:\s*(.+)$/);
      if (dateMatch && dateMatch[1]) {
        pubDate = dateMatch[1].trim();
        processedFrontmatter.push(`pubDate: "${pubDate}"`);
      }
    }
    // Extract description or summary
    else if (line.startsWith('description:') || line.startsWith('summary:')) {
      const descMatch = line.match(/(?:description|summary):\s*(.+)$/);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].trim().replace(/^["']|["']$/g, '');
        processedFrontmatter.push(`description: ${cleanAndQuote(description)}`);
      }
    }
    // Extract hero image if available
    else if (line.startsWith('image:') || line.startsWith('header-img:') || line.startsWith('hero:')) {
      const imgMatch = line.match(/(?:image|header-img|hero):\s*(.+)$/);
      if (imgMatch && imgMatch[1]) {
        heroImage = imgMatch[1].trim().replace(/^["']|["']$/g, '');
        processedFrontmatter.push(`heroImage: ${cleanAndQuote(heroImage)}`);
      }
    }
    // Handle tags
    else if (line.startsWith('tags:')) {
      // Convert tags list to array format
      const tagsMatch = line.match(/tags:\s*(.+)$/);
      if (tagsMatch && tagsMatch[1]) {
        const tagList = tagsMatch[1].trim()
          .split(/\s+/)
          .map(tag => tag.replace(/[,]/g, '').trim())
          .filter(tag => tag.length > 0);
        
        if (tagList.length > 0) {
          processedFrontmatter.push(`tags: [${tagList.map(t => `"${t}"`).join(', ')}]`);
        }
      } else {
        processedFrontmatter.push('tags: []');
      }
    }
    // Skip layout, comments, categories
    else if (!line.startsWith('layout:') && !line.startsWith('comments:') && !line.startsWith('categories:')) {
      processedFrontmatter.push(line);
    }
  });
  
  // Add description if missing
  if (!description && postContent.length > 0) {
    // Extract first paragraph for description
    const firstParagraph = postContent.split('\n\n')[0].replace(/[#*`]/g, '').trim();
    const truncatedDesc = firstParagraph.length > 150 
      ? firstParagraph.substring(0, 147) + '...' 
      : firstParagraph;
    
    processedFrontmatter.push(`description: ${cleanAndQuote(truncatedDesc)}`);
  }
  
  // Add tags if missing
  if (!frontmatter.includes('tags:')) {
    processedFrontmatter.push('tags: []');
  }
  
  // Generate new frontmatter
  const newFrontmatter = processedFrontmatter.join('\n');
  
  // Create the new content
  const newContent = `---\n${newFrontmatter}\n---\n\n${postContent}`;
  
  // Generate a new file name
  // Extract date from the original filename if it starts with YYYY-MM-DD
  let newFileName = fileName;
  const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  
  if (dateMatch) {
    // Use the slug part after the date
    newFileName = dateMatch[2];
  }
  
  // Clean up file extension
  newFileName = newFileName.replace(/\.markdown$/, '.md').replace(/\.mdx$/, '.mdx');
  
  // Make sure we have .md extension
  if (!newFileName.endsWith('.md') && !newFileName.endsWith('.mdx')) {
    newFileName = newFileName + '.md';
  }
  
  // Write the converted file
  const targetPath = path.join(targetDir, newFileName);
  await fs.writeFile(targetPath, newContent);
  console.log(`Saved to ${targetPath}`);
}

// Process all files in the source directory
async function convertAllFiles() {
  try {
    // Get list of all files
    const files = await fs.readdir(sourceDir);
    
    // Convert each file
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.markdown') || file.endsWith('.mdx'))) {
        await convertFile(filePath);
      }
    }
    
    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Run the conversion
convertAllFiles();