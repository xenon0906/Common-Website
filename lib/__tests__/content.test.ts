import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase before importing content
vi.mock('@/lib/firebase-server', () => ({
  isFirebaseConfigured: vi.fn(() => false),
  getFirestoreDocument: vi.fn(),
  getFirestoreCollection: vi.fn(),
}))

import {
  getHeroContent,
  getStats,
  getFeatures,
  getHowItWorksSteps,
  getTestimonials,
  getFAQs,
  getTeamMembers,
  DEFAULT_HERO,
  DEFAULT_STATS,
  DEFAULT_FEATURES,
  DEFAULT_STEPS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_TEAM,
} from '@/lib/content'

describe('Content Functions', () => {
  describe('when Firebase is not configured', () => {
    it('getHeroContent returns defaults', async () => {
      const result = await getHeroContent()
      expect(result).toEqual(DEFAULT_HERO)
    })

    it('getStats returns defaults', async () => {
      const result = await getStats()
      expect(result).toEqual(DEFAULT_STATS)
    })

    it('getFeatures returns defaults', async () => {
      const result = await getFeatures()
      expect(result).toEqual(DEFAULT_FEATURES)
    })

    it('getHowItWorksSteps returns defaults', async () => {
      const result = await getHowItWorksSteps()
      expect(result).toEqual(DEFAULT_STEPS)
    })

    it('getTestimonials returns defaults', async () => {
      const result = await getTestimonials()
      expect(result).toEqual(DEFAULT_TESTIMONIALS)
    })

    it('getFAQs returns active defaults', async () => {
      const result = await getFAQs()
      expect(result.every(faq => faq.isActive)).toBe(true)
    })

    it('getTeamMembers returns defaults', async () => {
      const result = await getTeamMembers()
      expect(result).toEqual(DEFAULT_TEAM)
    })
  })
})
