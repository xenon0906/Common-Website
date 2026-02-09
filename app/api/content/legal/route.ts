import { NextRequest, NextResponse } from 'next/server'
import { isFirebaseConfigured } from '@/lib/firebase-server'
import { getLegalContent, LegalPageData } from '@/lib/content'

// GET - Fetch legal page content by type (terms, privacy, refund)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'terms' | 'privacy' | 'refund'

    if (!type || !['terms', 'privacy', 'refund'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be terms, privacy, or refund.' },
        { status: 400 }
      )
    }

    const content = await getLegalContent(type)
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching legal content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch legal content' },
      { status: 500, headers: { 'X-Data-Source': 'fallback' } }
    )
  }
}
