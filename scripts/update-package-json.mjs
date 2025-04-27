#!/usr/bin/env node

/**
 * Script to update package.json with the new script for adding source metadata
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to package.json
const packageJsonPath = path.join(__dirname, '../package.json');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the new script if it doesn't exist
  if (!packageJson.scripts['add-source-metadata']) {
    packageJson.scripts['add-source-metadata'] = 'node scripts/add-source-metadata.mjs';
    
    // Write the updated package.json
    fs.writeFileSync(
      packageJsonPath, 
      JSON.stringify(packageJson, null, 2) + '\n'
    );
    
    console.log('Successfully added add-source-metadata script to package.json');
  } else {
    console.log('add-source-metadata script already exists in package.json');
  }
} catch (error) {
  console.error(`Error updating package.json: ${error.message}`);
}