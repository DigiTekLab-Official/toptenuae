// src/lib/utils.ts
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract plain text from Sanity Portable Text blocks
 * 
 * @param blocks - Portable Text blocks from Sanity or string
 * @returns Plain text string with paragraphs separated by double newlines
 */
export function toPlainText(blocks: any): string {
  if (!blocks) return '';
  
  // If it's already a string (mock data), return it
  if (typeof blocks === 'string') return blocks;
  
  // If it's an array (Sanity data), map through it
  if (Array.isArray(blocks)) {
    return blocks
      .map((block: any) => {
        // Only process text blocks
        if (block._type !== 'block' || !block.children) return '';
        
        // Extract text from all child spans
        return block.children
          .map((child: any) => child.text || '')
          .join('');
      })
      .filter((text: string) => text.trim()) // Remove empty blocks
      .join('\n\n');
  }
  
  return '';
}