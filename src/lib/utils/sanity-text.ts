// src/lib/utils/sanity-text.ts
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

/**
 * Format date to UAE timezone (en-AE locale)
 * @param dateString ISO date string
 * @param options Formatting options
 * @returns Formatted date string or null if invalid
 */
export function formatDate(
  dateString: string | undefined,
  options: {
    format?: 'short' | 'long' | 'full';
    includeDay?: boolean;
  } = {}
): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return null;
    }

    const { format = 'long', includeDay = true } = options;

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-AE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'Asia/Dubai',
        });

      case 'full':
        return date.toLocaleDateString('en-AE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Dubai',
        });

      case 'long':
      default:
        return date.toLocaleDateString('en-AE', {
          year: 'numeric',
          month: 'long',
          day: includeDay ? '2-digit' : undefined,
          timeZone: 'Asia/Dubai',
        });
    }
  } catch (error) {
    console.warn('Failed to format date:', error);
    return null;
  }
}

/**
 * Format time to UAE timezone
 * @param dateString ISO date string
 * @returns Formatted time string (HH:MM) or null if invalid
 */
export function formatTime(dateString: string | undefined): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleTimeString('en-AE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dubai',
    });
  } catch (error) {
    console.warn('Failed to format time:', error);
    return null;
  }
}

/**
 * Truncate alt text to a reasonable length
 * @param altText Original alt text
 * @param fallback Fallback text (e.g., title)
 * @param maxLength Maximum character length (default: 120)
 * @returns Concise alt text
 */
export function getConciseAlt(
  altText: string | undefined,
  fallback: string,
  maxLength: number = 120
): string {
  const text = altText || fallback;
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}