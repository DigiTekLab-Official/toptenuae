// src/repositories/index.ts
// Barrel export for all repositories - function-based exports only.
// No class exports: every repository in src/repositories/*.repository.ts
// exports plain async functions, and this file just re-exports them.
export * from './home.repository';
export * from './category.repository';
export * from './product.repository';
export * from './topten.repository';
export * from './deal.repository';
export * from './settings.repository';
export * from './post.repository';
export * from './search.repository';
export * from './sitemap.repository';