#!/usr/bin/env node

/**
 * Script to generate redirects for backward compatibility
 * This creates a Netlify _redirects file with patterns matching old URLs
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get current script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to blog content directory and output file
const contentDir = path.join(__dirname, '../src/content/blog');
const redirectsFile = path.join(__dirname, '../public/_redirects');

// Function to extract slug from filename
function extractSlugFromFilename(filename) {
  // For date-based filenames (2020-12-25-my-post.md)
  const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/);
  if (dateMatch) {
    const [, year, month, day, slug] = dateMatch;
    return {
      slug,
      year,
      month, 
      day,
      hasDate: true
    };
  }
  
  // For regular filenames (my-post.md)
  return {
    slug: filename.replace(/\.(md|mdx)$/, ''),
    hasDate: false
  };
}

// Generate the redirects content
async function generateRedirects() {
  // Default redirects
  let redirectsContent = `# Redirects from old URL patterns to new structure
# Generated on ${new Date().toISOString()}

# Generic patterns
/:year/:month/:day/:slug  /blog/:slug  301
/:slug                    /blog/:slug  301

# Legacy domain redirects
https://petersteinberger.com/*  https://steipete.com/:splat  301!

# Specific post redirects\n`;

  // Get all markdown files
  const markdownFiles = globSync(`${contentDir}/**/*.{md,mdx}`);
  console.log(`Found ${markdownFiles.length} markdown files to process`);
  
  // Process each file to generate specific redirects
  markdownFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const { slug, year, month, day, hasDate } = extractSlugFromFilename(filename);
    
    // Read the file to get frontmatter
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    
    // Determine the actual slug used in the blog
    const actualSlug = path.basename(filePath, path.extname(filePath));
    
    // Add specific redirects
    if (hasDate) {
      redirectsContent += `/${year}/${month}/${day}/${slug}  /blog/${actualSlug}  301\n`;
    }
    
    // Add redirect for plain slug
    redirectsContent += `/${actualSlug}  /blog/${actualSlug}  301\n`;
    
    // Handle source website redirects if applicable
    if (data.source === 'petersteinberger.com') {
      redirectsContent += `https://petersteinberger.com/${actualSlug}  https://steipete.com/blog/${actualSlug}  301!\n`;
    }
  });
  
  // Write to the redirects file
  fs.writeFileSync(redirectsFile, redirectsContent);
  console.log(`Generated redirects file at ${redirectsFile}`);
}

// Run the function
generateRedirects().catch(err => {
  console.error('Error generating redirects:', err);
  process.exit(1);
});