// src/utils/sanity-text.ts
import { toPlainText } from '@portabletext/toolkit';

export function cleanText(value: any) {
  if (!value) return '';
  
  // 1. Convert Portable Text to String (if needed)
  let text = typeof value === 'string' ? value : toPlainText(value);

  // 2. Decode HTML Entities (Prevent "Prices &amp; Reviews" bug)
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Remove extra whitespace/newlines
    .replace(/\s+/g, ' ')
    .trim();
}