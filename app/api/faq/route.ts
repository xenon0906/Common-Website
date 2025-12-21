import { NextRequest, NextResponse } from 'next/server'
import { getFAQs, DEFAULT_FAQS } from '@/lib/content'

// Static mode - returns static FAQ data
export async function GET() {
  try {
    const faqs = await getFAQs()
    // Transform to match expected format
    const formattedFaqs = faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      visible: faq.isActive,
      order: faq.order,
    }))
    return NextResponse.json(formattedFaqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(DEFAULT_FAQS, { status: 200 })
  }
}

// POST - Backend disabled in static mode
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Backend not connected',
      message: 'Write operations are disabled in static mode. Connect database to enable.',
    },
    { status: 503 }
  )
}

// PUT - Backend disabled in static mode
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Backend not connected',
      message: 'Write operations are disabled in static mode. Connect database to enable.',
    },
    { status: 503 }
  )
}

// DELETE - Backend disabled in static mode
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Backend not connected',
      message: 'Write operations are disabled in static mode. Connect database to enable.',
    },
    { status: 503 }
  )
}
