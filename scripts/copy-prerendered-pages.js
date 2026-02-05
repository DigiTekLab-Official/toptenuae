#!/usr/bin/env node

/**
 * Copy Prerendered Pages to OpenNext Assets
 * 
 * This script copies prerendered HTML pages from Next.js build output
 * to the OpenNext assets directory for Cloudflare Pages deployment.
 * 
 * Without this, Cloudflare Pages would only get static assets and the
 * Worker wouldn't find the prerendered pages to serve.
 */

const fs = require('fs');
const path = require('path');

const NEXT_SERVER_DIR = '.next/standalone/.next/server/app';
const OPEN_NEXT_ASSETS_DIR = '.open-next/assets';

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile()) {
      callback(filePath);
    }
  });
}

function main() {
  try {
    // Ensure source directory exists
    if (!fs.existsSync(NEXT_SERVER_DIR)) {
      console.warn(`⚠️ Next.js server directory not found: ${NEXT_SERVER_DIR}`);
      console.warn('This is normal if no pages were pre-rendered.');
      process.exit(0);
    }

    // Ensure destination directory exists
    if (!fs.existsSync(OPEN_NEXT_ASSETS_DIR)) {
      fs.mkdirSync(OPEN_NEXT_ASSETS_DIR, { recursive: true });
    }

    let copiedCount = 0;

    // Walk through all HTML files in Next.js build
    walkDir(NEXT_SERVER_DIR, (filePath) => {
      if (!filePath.endsWith('.html')) return;

      // Get relative path from the app directory
      const relativePath = path.relative(NEXT_SERVER_DIR, filePath);
      
      // Remove the .html extension for the URL path
      const urlPath = relativePath.replace(/\.html$/, '');
      
      // Create destination with trailing index.html for directories
      let destPath;
      if (urlPath === 'index') {
        // Root index
        destPath = path.join(OPEN_NEXT_ASSETS_DIR, 'index.html');
      } else if (urlPath.endsWith('/index')) {
        // Category/slug index pages
        destPath = path.join(OPEN_NEXT_ASSETS_DIR, urlPath + '.html');
      } else {
        // Regular pages (deals, reviews, etc.)
        destPath = path.join(OPEN_NEXT_ASSETS_DIR, urlPath + '.html');
      }

      // Copy the file
      copyFile(filePath, destPath);
      copiedCount++;

      console.log(`✓ Copied: /${urlPath}`);
    });

    console.log(`\n✅ Successfully copied ${copiedCount} prerendered pages to ${OPEN_NEXT_ASSETS_DIR}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error copying prerendered pages:', error);
    process.exit(1);
  }
}

main();
