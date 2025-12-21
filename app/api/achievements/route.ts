import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    const achievement = await prisma.achievement.create({
      data: {
        type: body.type,
        title: body.title,
        content: body.content || null,
        mediaUrl: body.mediaUrl || null,
        embedCode: body.embedCode || null,
        metrics: body.metrics || null,
      },
    })

    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    )
  }
}
