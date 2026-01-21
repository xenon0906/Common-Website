import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// Required for static export - returns empty array (API routes won't work on static hosting)
export function generateStaticParams() {
  return []
}

// GET single reel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reel = await prisma.instagramReel.findUnique({
      where: { id },
    })

    if (!reel) {
      return NextResponse.json({ error: 'Reel not found' }, { status: 404 })
    }

    return NextResponse.json(reel)
  } catch (error) {
    console.error('Error fetching reel:', error)
    return NextResponse.json({ error: 'Failed to fetch reel' }, { status: 500 })
  }
}

// PUT update reel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const { reelId, title, description, visible, order } = body

    const reel = await prisma.instagramReel.update({
      where: { id },
      data: {
        reelId,
        title,
        description,
        visible,
        order,
      },
    })

    return NextResponse.json(reel)
  } catch (error) {
    console.error('Error updating reel:', error)
    return NextResponse.json({ error: 'Failed to update reel' }, { status: 500 })
  }
}

// DELETE reel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await params
    await prisma.instagramReel.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reel:', error)
    return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 })
  }
}
