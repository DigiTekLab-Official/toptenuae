// src/utils/sanity-text.ts
import { toPlainText } from '@portabletext/toolkit';

export function cleanText(value: any) {
  if (!value) return '';
  
  let text = '';

  // 1. Determine Type and Convert to String
  if (typeof value === 'string') {
    text = value;
  } else if (Array.isArray(value)) {
    // ✅ SAFETY: Only pass Arrays (Blocks) to the toolkit
    // This prevents crashes if 'value' is an unexpected object
    try {
      text = toPlainText(value);
    } catch (err) {
      console.warn('Failed to convert Portable Text:', err);
      return '';
    }
  } else {
    // Fallback for numbers, booleans, etc.
    text = String(value);
  }

  // 2. Decode HTML Entities & Clean Whitespace
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Remove newlines and multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}