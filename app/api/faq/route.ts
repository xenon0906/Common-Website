import { NextResponse } from 'next/server'
import { getFirestoreCollection, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_FAQS, FAQData } from '@/lib/content'

// GET - Fetch FAQs from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const faqs = await getFirestoreCollection<FAQData>(
        'faq',
        DEFAULT_FAQS,
        'order'
      )

      // Transform to match expected format and filter active items
      const formattedFaqs = faqs
        .filter(faq => faq.isActive !== false)
        .map(faq => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          visible: faq.isActive,
          order: faq.order,
        }))

      return NextResponse.json(formattedFaqs)
    }

    // Otherwise return static defaults
    const formattedDefaults = DEFAULT_FAQS.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      visible: faq.isActive,
      order: faq.order,
    }))
    return NextResponse.json(formattedDefaults)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    const formattedDefaults = DEFAULT_FAQS.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      visible: faq.isActive,
      order: faq.order,
    }))
    return NextResponse.json(formattedDefaults, { status: 200 })
  }
}
