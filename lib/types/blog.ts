import { Timestamp } from 'firebase/firestore'

// Content Block Types for Rich Content Editor
export type ContentBlockType = 'paragraph' | 'heading' | 'image' | 'quote' | 'list'

export interface ContentBlockBase {
  id: string
  type: ContentBlockType
  order: number
}

export interface ParagraphBlock extends ContentBlockBase {
  type: 'paragraph'
  content: string // Markdown for inline formatting (bold, italic, links)
}

export interface HeadingBlock extends ContentBlockBase {
  type: 'heading'
  content: string
  level: 1 | 2 | 3 // h1, h2, h3
}

export interface ImageBlock extends ContentBlockBase {
  type: 'image'
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface QuoteBlock extends ContentBlockBase {
  type: 'quote'
  content: string
  attribution?: string
}

export interface ListBlock extends ContentBlockBase {
  type: 'list'
  items: string[]
  ordered: boolean
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | QuoteBlock
  | ListBlock

// Content version type
export type ContentVersion = 1 | 2 // 1 = markdown, 2 = blocks

export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
}

export interface BlogPost {
  id?: string
  title: string
  slug: string
  content: string // Legacy markdown content
  excerpt?: string

  // Rich Content (v2)
  contentBlocks?: ContentBlock[] // Structured content blocks
  contentVersion?: ContentVersion // 1 = markdown, 2 = blocks

  // Author
  author?: BlogAuthor

  // Taxonomy
  category?: string
  categoryName?: string
  tags: string[]

  // Reading
  readingTime?: number // Auto-calculated in minutes
  wordCount?: number

  // Featured Image
  featuredImage?: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  imageUrl?: string // Legacy support

  // SEO
  metaTitle?: string
  metaDesc?: string
  metaDescription?: string // Alias
  keywords?: string
  canonicalUrl?: string

  // Status
  status: 'draft' | 'published' | 'scheduled'
  published?: boolean // Legacy support
  scheduledAt?: Timestamp | Date | string
  publishedAt?: Timestamp | Date | string

  // Version History
  version?: number
  revisions?: BlogRevision[]

  // Metadata
  createdAt?: Timestamp | Date | string
  updatedAt?: Timestamp | Date | string
  viewCount?: number
}

export interface BlogRevision {
  id: string
  version: number
  title: string
  content: string
  createdAt: Timestamp | Date | string
  createdBy?: string
}

export const DEFAULT_CATEGORIES: BlogCategory[] = [
  { id: 'tips', name: 'Tips & Guides', slug: 'tips', description: 'Helpful tips for ride-sharing', color: 'bg-blue-500' },
  { id: 'news', name: 'News', slug: 'news', description: 'Latest updates and announcements', color: 'bg-green-500' },
  { id: 'stories', name: 'User Stories', slug: 'stories', description: 'Real experiences from users', color: 'bg-purple-500' },
  { id: 'safety', name: 'Safety', slug: 'safety', description: 'Safety tips and guidelines', color: 'bg-red-500' },
  { id: 'savings', name: 'Savings', slug: 'savings', description: 'Money-saving strategies', color: 'bg-yellow-500' },
  { id: 'eco', name: 'Eco-Friendly', slug: 'eco', description: 'Environmental impact', color: 'bg-emerald-500' },
]

export const DEFAULT_TAGS = [
  'ride-sharing',
  'cab-pooling',
  'commute',
  'savings',
  'safety',
  'students',
  'office',
  'delhi-ncr',
  'bangalore',
  'mumbai',
  'eco-friendly',
  'carpooling',
  'app-features',
  'how-to',
]

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/`(.*?)`/g, '$1') // Code
    .replace(/\n+/g, ' ') // Newlines
    .trim()

  if (plainText.length <= maxLength) return plainText
  return plainText.slice(0, maxLength - 3) + '...'
}
