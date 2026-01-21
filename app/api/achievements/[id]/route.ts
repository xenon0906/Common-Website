import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// Required for static export - returns empty array (API routes won't work on static hosting)
export function generateStaticParams() {
  return []
}

interface RouteParams {
  params: { id: string }
}

// GET - Fetch single achievement by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const achievement = await prisma.achievement.findUnique({
      where: { id },
    })

    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievement' },
      { status: 500 }
    )
  }
}

// PUT - Update achievement
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = params
    const body = await request.json()

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        type: body.type,
        title: body.title,
        content: body.content || null,
        mediaUrl: body.mediaUrl || null,
        embedCode: body.embedCode || null,
        metrics: body.metrics || null,
      },
    })

    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    )
  }
}

// DELETE - Delete achievement
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = params
    await prisma.achievement.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    )
  }
}
