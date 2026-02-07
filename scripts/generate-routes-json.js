#!/usr/bin/env node
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
    // We removed sitemap and robots from here because they are now STATIC
  ],
  exclude: [
    '/_next/*',
    '/static/*',
    '/sitemap.xml', // ✅ Serve the static file we generated
    '/robots.txt',  // ✅ Serve the static file Next.js built
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
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
  console.log(`✓ Generated _routes.json at ${routesFile}`);
} catch (err) {
  console.error(`✗ Failed to generate _routes.json:`, err.message);
  process.exit(1);
}