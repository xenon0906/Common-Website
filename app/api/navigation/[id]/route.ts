import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// Required for static export - returns empty array (API routes won't work on static hosting)
export function generateStaticParams() {
  return []
}

// GET single navigation item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.navigationItem.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching navigation item:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation item' }, { status: 500 })
  }
}

// PUT update navigation item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const { label, href, icon, visible, external, order, location, section } = body

    const item = await prisma.navigationItem.update({
      where: { id },
      data: {
        label,
        href,
        icon,
        visible,
        external,
        order,
        location,
        section,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating navigation item:', error)
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 })
  }
}

// DELETE navigation item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await params
    await prisma.navigationItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting navigation item:', error)
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 })
  }
}
