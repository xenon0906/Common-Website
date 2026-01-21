import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// GET all navigation items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') // header or footer

    const where = location ? { location } : {}

    const items = await prisma.navigationItem.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 })
  }
}

// POST create new navigation item
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { label, href, icon, location, section, visible, external, order } = body

    const item = await prisma.navigationItem.create({
      data: {
        label,
        href,
        icon,
        location: location || 'header',
        section,
        visible: visible ?? true,
        external: external ?? false,
        order: order || 0,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating navigation item:', error)
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 })
  }
}

// PUT update navigation items
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { items } = body

    // Delete existing and recreate (simpler for reordering)
    const location = items[0]?.location || 'header'

    await prisma.$transaction([
      prisma.navigationItem.deleteMany({ where: { location } }),
      ...items.map((item: any, index: number) =>
        prisma.navigationItem.create({
          data: {
            label: item.label,
            href: item.href,
            icon: item.icon,
            location: item.location || 'header',
            section: item.section,
            visible: item.visible ?? true,
            external: item.external ?? false,
            order: index,
          },
        })
      ),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating navigation:', error)
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 })
  }
}

// DELETE navigation item
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    await prisma.navigationItem.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting navigation item:', error)
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 })
  }
}
