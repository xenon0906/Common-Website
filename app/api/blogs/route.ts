import { NextRequest, NextResponse } from 'next/server'
import { getBlogs, DEFAULT_BLOGS } from '@/lib/content'

// Static mode - returns static blog data
export async function GET() {
  try {
    const blogs = await getBlogs()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(DEFAULT_BLOGS, { status: 200 })
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
