// src/lib/utils.ts
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// NEW: Helper to extract plain text from Sanity Portable Text
export function toPlainText(blocks: any) {
  if (!blocks) return '';
  // If it's already a string (mock data), return it
  if (typeof blocks === 'string') return blocks;
  // If it's an array (Sanity data), map through it
  if (Array.isArray(blocks)) {
    return blocks
      .map((block: any) => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map((child: any) => child.text).join('');
      })
      .join('\n\n');
  }
  return '';
}