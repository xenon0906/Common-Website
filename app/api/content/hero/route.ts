import { NextRequest, NextResponse } from 'next/server'
import { getHeroContent, DEFAULT_HERO } from '@/lib/content'

export const dynamic = 'force-dynamic'

// Static mode - returns static hero content
export async function GET() {
  try {
    const hero = await getHeroContent()
    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return NextResponse.json(DEFAULT_HERO, { status: 200 })
  }
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
