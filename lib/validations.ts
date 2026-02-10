import { z } from 'zod'

// ===== BLOG SCHEMAS =====
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long'),
  content: z.string().max(100_000).optional().default(''),
  metaDesc: z.string().max(160).optional().default(''),
  excerpt: z.string().max(300).optional().default(''),
  keywords: z.string().max(500).optional().default(''),
  imageUrl: z.string().max(2000).optional().default(''),
  published: z.boolean().optional().default(false),
  category: z.string().max(100).optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  contentBlocks: z.array(z.any()).optional(),
  contentVersion: z.number().int().min(1).max(2).optional(),
})

export const updateBlogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string().max(100_000).optional().default(''),
  metaDesc: z.string().max(160).optional().default(''),
  excerpt: z.string().max(300).optional().default(''),
  keywords: z.string().max(500).optional().default(''),
  imageUrl: z.string().max(2000).optional().default(''),
  published: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  wordCount: z.number().int().positive().optional(),
  readingTime: z.number().int().positive().optional(),
  category: z.string().max(100).optional().default(''),
  contentBlocks: z.array(z.any()).optional(),
  contentVersion: z.number().int().min(1).max(2).optional(),
})

// ===== NAVIGATION SCHEMAS =====
export const createNavigationSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  href: z.string().min(1, 'Href is required').max(500),
  icon: z.string().max(100).optional(),
  location: z.enum(['header', 'footer', 'sidebar']).default('header'),
  section: z.string().max(100).optional(),
  visible: z.boolean().default(true),
  external: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
})

export const bulkUpdateNavigationSchema = z.object({
  items: z.array(createNavigationSchema).min(1).max(50),
})

// ===== TEAM SCHEMAS =====
export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().max(100).optional().default(''),
  category: z.string().max(50).optional().default('team'),
  bio: z.string().max(2000).optional().default(''),
  details: z.string().max(5000).optional().default(''),
  imageUrl: z.string().max(2000).optional().default(''),
  portraitUrl: z.string().max(2000).optional().default(''),
  email: z.string().email().max(254).optional().or(z.literal('')).default(''),
  linkedin: z.string().max(500).optional().default(''),
  twitter: z.string().max(500).optional().default(''),
  order: z.number().int().min(0).optional(),
})

// ===== ACHIEVEMENT SCHEMAS =====
export const createAchievementSchema = z.object({
  type: z.enum(['CERT', 'VIDEO', 'POST']),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(10_000).optional().nullable(),
  mediaUrl: z.string().max(2000).optional().nullable().or(z.literal('')),
  embedCode: z.string().max(5000).optional().nullable(),
  metrics: z.record(z.unknown()).optional().nullable(),
})

// ===== MEDIA SCHEMAS =====
export const registerMediaSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().min(1).max(2000),
  category: z.string().max(50).optional().default('general'),
  mimeType: z.string().min(1).max(100),
  size: z.number().int().min(0).optional().default(0),
  alt: z.string().max(500).optional().default(''),
})

// ===== SETTINGS SCHEMAS =====
export const updateSettingSchema = z.object({
  category: z.string().min(1, 'Category is required').max(50),
  key: z.string().min(1, 'Key is required').max(50),
  value: z.unknown(),
})

export const settingsSchema = z.object({
  site: z.record(z.string()).optional(),
  contact: z.record(z.string()).optional(),
  social: z.record(z.string()).optional(),
  founders: z.array(z.string()).optional(),
  apps: z.record(z.union([z.string(), z.boolean()])).optional(),
  theme: z.record(z.string()).optional(),
  images: z.record(z.string()).optional(),
}).strict()

// ===== HELPER =====
export function validateBody<T>(schema: z.ZodType<T>, data: unknown):
  { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  if (!result.success) {
    const firstError = result.error.errors[0]
    return {
      success: false,
      error: `${firstError.path.join('.')}: ${firstError.message}`,
    }
  }
  return { success: true, data: result.data }
}
