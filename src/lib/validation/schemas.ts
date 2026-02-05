import { z } from 'zod';

// =============================================================================
// NEWSLETTER SUBSCRIPTION VALIDATION
// =============================================================================

export const SubscribeSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  fax: z.string().optional(), // Honeypot field
  token: z.string().min(1, 'CAPTCHA token is required'),
});

export type SubscribeRequest = z.infer<typeof SubscribeSchema>;

// =============================================================================
// NEWSLETTER CONFIRMATION VALIDATION
// =============================================================================

export const ConfirmSubscriptionSchema = z.object({
  token: z.string().min(1, 'Confirmation token is required'),
});

export type ConfirmSubscriptionRequest = z.infer<typeof ConfirmSubscriptionSchema>;

// =============================================================================
// API REPORT SUBMISSION VALIDATION
// =============================================================================

export const ReportSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type ReportRequest = z.infer<typeof ReportSchema>;

// =============================================================================
// SEARCH VALIDATION
// =============================================================================

export const SearchSchema = z.object({
  q: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
    .trim(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SearchRequest = z.infer<typeof SearchSchema>;

// =============================================================================
// AMAZON SYNC VALIDATION
// =============================================================================

export const AmazonSyncSchema = z.object({
  secret: z.string().min(1, 'Secret is required'),
});

export type AmazonSyncRequest = z.infer<typeof AmazonSyncSchema>;
