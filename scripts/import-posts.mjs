#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Repositories to import from
const repositories = [
  {
    name: 'steipete.com',
    url: 'https://github.com/steipete/steipete.com.git',
    contentPath: '_posts', // Path within repo where posts are stored
    tempDir: 'temp-steipete.com'
  },
  {
    name: 'petersteinberger.com',
    url: 'https://github.com/steipete/petersteinberger.com.git',
    contentPath: '_posts', // Path within repo where posts are stored
    tempDir: 'temp-petersteinberger.com'
  }
];

// Target directory for blog posts
const targetDir = path.join(process.cwd(), 'src', 'content', 'blog');

// Function to clone a repository
async function cloneRepo(repo) {
  console.log(`Cloning ${repo.name} from ${repo.url}...`);
  try {
    await execAsync(`git clone ${repo.url} ${repo.tempDir}`);
    console.log(`Successfully cloned ${repo.name}`);
  } catch (error) {
    console.error(`Error cloning ${repo.name}:`, error.message);
    throw error;
  }
}

// Function to clean up cloned repositories
async function cleanupRepos() {
  for (const repo of repositories) {
    try {
      await fs.rm(repo.tempDir, { recursive: true, force: true });
      console.log(`Cleaned up ${repo.tempDir}`);
    } catch (error) {
      console.error(`Error cleaning up ${repo.tempDir}:`, error.message);
    }
  }
}

// Function to process a post's frontmatter and content
function processPost(content) {
  // Split content into frontmatter and post body
  const parts = content.split(/---\r?\n/);
  
  if (parts.length < 3) {
    console.warn('Invalid post format, skipping...');
    return null;
  }
  
  let frontmatter = parts[1];
  const postContent = parts.slice(2).join('---\n');
  
  // Update frontmatter to match Astro's format
  frontmatter = frontmatter
    .replace(/^layout:.*$/m, '')
    .replace(/^permalink:.*$/m, '')
    .replace(/^categories:.*$/m, '')
    .replace(/^date: (.*)$/m, 'pubDate: $1')
    .replace(/^title: (.*)$/m, 'title: $1')
    .replace(/^description: (.*)$/m, 'description: $1')
    .replace(/^image: (.*)$/m, 'heroImage: $1')
    .trim();
  
  // Add required properties if missing
  if (!frontmatter.includes('description:')) {
    frontmatter += '\ndescription: ""';
  }
  
  return `---\n${frontmatter}\n---\n\n${postContent}`;
}

// Main function to import posts
async function importPosts() {
  try {
    // Create target directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });
    
    // Process each repository
    for (const repo of repositories) {
      await cloneRepo(repo);
      
      // Get all markdown files from the content directory
      const contentDir = path.join(repo.tempDir, repo.contentPath);
      const files = await fs.readdir(contentDir);
      
      // Process each markdown file
      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.markdown')) {
          console.log(`Processing ${file} from ${repo.name}...`);
          const filePath = path.join(contentDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Process the content
          const processedContent = processPost(content);
          if (!processedContent) continue;
          
          // Create a filename based on the original filename
          // Extract YYYY-MM-DD-title-slug format to a cleaner slug
          const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md(x)?$/);
          const newFilename = match ? `${match[2]}.md` : file;
          
          // Write the processed content to the target directory
          await fs.writeFile(path.join(targetDir, newFilename), processedContent);
          console.log(`Saved ${newFilename} to ${targetDir}`);
        }
      }
    }
    
    console.log('Post import completed successfully!');
  } catch (error) {
    console.error('Error importing posts:', error);
  } finally {
    // Clean up cloned repositories
    await cleanupRepos();
  }
}

// Run the import function
importPosts();