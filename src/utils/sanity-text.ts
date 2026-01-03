// src/utils/sanity-text.ts
import { toPlainText } from '@portabletext/toolkit';

export function cleanText(value: any) {
  if (!value) return '';
  if (typeof value === 'string') return value; // Handle if it's already a string
  return toPlainText(value);
}