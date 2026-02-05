#!/usr/bin/env node

/**
 * Fix OpenNext CSS structure for Turbopack-built Next.js apps
 * 
 * OpenNext expects CSS files at: .next/standalone/.next/static/css/
 * But Turbopack puts them at: .next/static/chunks/
 * 
 * This script copies CSS files to the expected location.
 */

const fs = require('fs');
const path = require('path');

// The CSS files are in .next/standalone/.next/static/chunks/ (from Turbopack)
// OpenNext expects them in .next/standalone/.next/static/css/
const source = path.join(process.cwd(), '.next', 'standalone', '.next', 'static', 'chunks');
const target = path.join(process.cwd(), '.next', 'standalone', '.next', 'static', 'css');

console.log('🔧 Fixing OpenNext CSS structure...');
console.log(`   Source: ${source}`);
console.log(`   Target: ${target}`);

// Create target directory if it doesn't exist
try {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    console.log(`   ✓ Created target directory`);
  }

  // Copy all .css files from source to target
  if (fs.existsSync(source)) {
    const files = fs.readdirSync(source).filter(f => f.endsWith('.css'));
    
    if (files.length === 0) {
      console.log('   ℹ️  No CSS files found to copy');
    } else {
      files.forEach(file => {
        const srcFile = path.join(source, file);
        const targetFile = path.join(target, file);
        fs.copyFileSync(srcFile, targetFile);
        console.log(`   ✓ Copied ${file}`);
      });
      console.log(`   ✓ Copied ${files.length} CSS file(s)`);
    }
  } else {
    console.log('   ⚠️  Source directory does not exist');
  }

  console.log('✓ OpenNext CSS structure fixed\n');
} catch (error) {
  console.error('✗ Error fixing CSS structure:', error.message);
  process.exit(1);
}
