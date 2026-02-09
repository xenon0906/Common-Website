import { describe, it, expect } from 'vitest'
import {
  createBlogSchema,
  updateBlogSchema,
  createNavigationSchema,
  bulkUpdateNavigationSchema,
  createTeamMemberSchema,
  createAchievementSchema,
  registerMediaSchema,
  updateSettingSchema,
  settingsSchema,
  validateBody,
} from '@/lib/validations'

describe('Validations', () => {
  describe('createBlogSchema', () => {
    it('accepts valid blog data', () => {
      const result = createBlogSchema.safeParse({
        title: 'Test Blog',
        slug: 'test-blog',
        content: 'Some content here',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty title', () => {
      const result = createBlogSchema.safeParse({
        title: '',
        slug: 'test-blog',
        content: 'Content',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing slug', () => {
      const result = createBlogSchema.safeParse({
        title: 'Test Blog',
        content: 'Content',
      })
      expect(result.success).toBe(false)
    })

    it('rejects title exceeding 200 chars', () => {
      const result = createBlogSchema.safeParse({
        title: 'A'.repeat(201),
        slug: 'test',
        content: 'Content',
      })
      expect(result.success).toBe(false)
    })

    it('defaults optional fields', () => {
      const result = createBlogSchema.safeParse({
        title: 'Test',
        slug: 'test',
        content: 'Content',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.metaDesc).toBe('')
        expect(result.data.excerpt).toBe('')
        expect(result.data.keywords).toBe('')
        expect(result.data.imageUrl).toBe('')
        expect(result.data.published).toBe(false)
      }
    })

    it('accepts imageUrl as relative path', () => {
      const result = createBlogSchema.safeParse({
        title: 'Test',
        slug: 'test',
        content: 'Content',
        imageUrl: '/uploads/blog/image.jpg',
      })
      expect(result.success).toBe(true)
    })

    it('accepts imageUrl as full URL', () => {
      const result = createBlogSchema.safeParse({
        title: 'Test',
        slug: 'test',
        content: 'Content',
        imageUrl: 'https://example.com/image.jpg',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('updateBlogSchema', () => {
    it('accepts valid update data', () => {
      const result = updateBlogSchema.safeParse({
        title: 'Updated Title',
        slug: 'updated-title',
        content: 'Updated content',
        status: 'published',
      })
      expect(result.success).toBe(true)
    })

    it('accepts optional wordCount and readingTime', () => {
      const result = updateBlogSchema.safeParse({
        title: 'Test',
        slug: 'test',
        content: 'Content',
        wordCount: 150,
        readingTime: 2,
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid status enum', () => {
      const result = updateBlogSchema.safeParse({
        title: 'Test',
        slug: 'test',
        content: 'Content',
        status: 'unknown',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createNavigationSchema', () => {
    it('accepts valid navigation item', () => {
      const result = createNavigationSchema.safeParse({
        label: 'Home',
        href: '/',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.location).toBe('header')
        expect(result.data.visible).toBe(true)
        expect(result.data.external).toBe(false)
        expect(result.data.order).toBe(0)
      }
    })

    it('rejects empty label', () => {
      const result = createNavigationSchema.safeParse({
        label: '',
        href: '/',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid location enum', () => {
      const result = createNavigationSchema.safeParse({
        label: 'Home',
        href: '/',
        location: 'footer',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('bulkUpdateNavigationSchema', () => {
    it('accepts array of navigation items', () => {
      const result = bulkUpdateNavigationSchema.safeParse({
        items: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty items array', () => {
      const result = bulkUpdateNavigationSchema.safeParse({
        items: [],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createTeamMemberSchema', () => {
    it('accepts valid team member', () => {
      const result = createTeamMemberSchema.safeParse({
        name: 'John Doe',
        role: 'Developer',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty name', () => {
      const result = createTeamMemberSchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts empty string for email', () => {
      const result = createTeamMemberSchema.safeParse({
        name: 'John',
        email: '',
      })
      expect(result.success).toBe(true)
    })

    it('accepts valid email', () => {
      const result = createTeamMemberSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const result = createTeamMemberSchema.safeParse({
        name: 'John',
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createAchievementSchema', () => {
    it('accepts valid achievement', () => {
      const result = createAchievementSchema.safeParse({
        type: 'CERT',
        title: 'AWS Certification',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid type enum', () => {
      const result = createAchievementSchema.safeParse({
        type: 'UNKNOWN',
        title: 'Something',
      })
      expect(result.success).toBe(false)
    })

    it('accepts nullable content and mediaUrl', () => {
      const result = createAchievementSchema.safeParse({
        type: 'VIDEO',
        title: 'Demo Video',
        content: null,
        mediaUrl: null,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('registerMediaSchema', () => {
    it('accepts valid media registration', () => {
      const result = registerMediaSchema.safeParse({
        filename: 'image.jpg',
        url: '/uploads/image.jpg',
        mimeType: 'image/jpeg',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.category).toBe('general')
        expect(result.data.size).toBe(0)
        expect(result.data.alt).toBe('')
      }
    })

    it('rejects missing filename', () => {
      const result = registerMediaSchema.safeParse({
        url: '/uploads/image.jpg',
        mimeType: 'image/jpeg',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateSettingSchema', () => {
    it('accepts valid setting update', () => {
      const result = updateSettingSchema.safeParse({
        category: 'site',
        key: 'name',
        value: 'Snapgo',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty category', () => {
      const result = updateSettingSchema.safeParse({
        category: '',
        key: 'name',
        value: 'Snapgo',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('settingsSchema', () => {
    it('accepts valid full settings object', () => {
      const result = settingsSchema.safeParse({
        site: { name: 'Snapgo', tagline: 'Cab Pooling' },
        contact: { email: 'info@snapgo.co.in' },
      })
      expect(result.success).toBe(true)
    })

    it('rejects unknown extra fields (strict mode)', () => {
      const result = settingsSchema.safeParse({
        site: { name: 'Snapgo' },
        unknownField: 'value',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('validateBody helper', () => {
    it('returns success with parsed data on valid input', () => {
      const result = validateBody(createBlogSchema, {
        title: 'Test',
        slug: 'test',
        content: 'Content',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Test')
      }
    })

    it('returns error string on invalid input', () => {
      const result = validateBody(createBlogSchema, {
        title: '',
        slug: 'test',
        content: 'Content',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('Title is required')
      }
    })

    it('includes field path in error message', () => {
      const result = validateBody(createBlogSchema, {
        title: 'Test',
        slug: '',
        content: 'Content',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('slug')
      }
    })
  })
})
