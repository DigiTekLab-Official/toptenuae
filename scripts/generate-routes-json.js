#!/usr/bin/env node
/**
 * Generate _routes.json for Cloudflare Pages
 * This tells Cloudflare which paths should go to the Worker vs static assets
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', '.open-next', 'assets');
const routesFile = path.join(assetsDir, '_routes.json');

const routes = {
  version: 1,
  include: [
    '/api/*',
    '/newsletter/*',
    '/search',
    '/report',
  ],
  exclude: [
    '/_next/*',
    '/static/*',
    '*.js',
    '*.css',
    '*.svg',
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.gif',
    '*.webp',
    '*.ico',
    '*.woff',
    '*.woff2',
    '*.ttf',
    '*.eot',
    '*.json',
  ],
};

try {
  fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
  console.log(`✓ Generated _routes.json at ${routesFile}`);
} catch (err) {
  console.error(`✗ Failed to generate _routes.json:`, err.message);
  process.exit(1);
}
