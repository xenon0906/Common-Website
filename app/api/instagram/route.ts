import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// GET all Instagram reels
export async function GET() {
  try {
    const reels = await prisma.instagramReel.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(reels)
  } catch (error) {
    console.error('Error fetching reels:', error)
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 })
  }
}

// POST create new reel
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { reelId, title, description, visible, order } = body

    const reel = await prisma.instagramReel.create({
      data: {
        reelId,
        title,
        description,
        visible: visible ?? true,
        order: order || 0,
      },
    })

    return NextResponse.json(reel, { status: 201 })
  } catch (error) {
    console.error('Error creating reel:', error)
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 })
  }
}

// PUT update reels
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { reels } = body

    // Update all reels in a transaction
    await prisma.$transaction(
      reels.map((reel: any) =>
        prisma.instagramReel.upsert({
          where: { id: reel.id || 'new' },
          update: {
            reelId: reel.reelId,
            title: reel.title,
            description: reel.description,
            visible: reel.visible,
            order: reel.order,
          },
          create: {
            reelId: reel.reelId,
            title: reel.title,
            description: reel.description,
            visible: reel.visible ?? true,
            order: reel.order || 0,
          },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating reels:', error)
    return NextResponse.json({ error: 'Failed to update reels' }, { status: 500 })
  }
}

// DELETE reel
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Reel ID required' }, { status: 400 })
    }

    await prisma.instagramReel.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reel:', error)
    return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 })
  }
}
