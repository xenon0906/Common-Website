import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

// GET - Fetch all how it works steps
export async function GET() {
  try {
    const steps = await prisma.howItWorksStep.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    if (steps.length === 0) {
      return NextResponse.json([
        { id: '1', step: 1, title: 'Enter Your Destination', description: 'Set your pickup and drop location in the app', icon: 'MapPin', order: 1, isActive: true },
        { id: '2', step: 2, title: 'Find Your Match', description: 'Our algorithm finds people going to the same destination within 750m', icon: 'Search', order: 2, isActive: true },
        { id: '3', step: 3, title: 'Share & Save', description: 'Connect, chat, meet at a common point, share the fare, and save money', icon: 'Users', order: 3, isActive: true },
      ])
    }

    return NextResponse.json(steps)
  } catch (error) {
    console.error('Error fetching how it works steps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch how it works steps' },
      { status: 500 }
    )
  }
}

// POST - Create new step
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { step, title, description, icon, order, isActive } = body

    const newStep = await prisma.howItWorksStep.create({
      data: {
        step: parseInt(step),
        title,
        description,
        icon: icon || 'Circle',
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('how-it-works')
    return NextResponse.json(newStep, { status: 201 })
  } catch (error) {
    console.error('Error creating how it works step:', error)
    return NextResponse.json(
      { error: 'Failed to create how it works step' },
      { status: 500 }
    )
  }
}

// PUT - Update step
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, step, title, description, icon, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Step ID is required' },
        { status: 400 }
      )
    }

    const updatedStep = await prisma.howItWorksStep.update({
      where: { id },
      data: {
        step: parseInt(step),
        title,
        description,
        icon: icon || 'Circle',
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('how-it-works')
    return NextResponse.json(updatedStep)
  } catch (error) {
    console.error('Error updating how it works step:', error)
    return NextResponse.json(
      { error: 'Failed to update how it works step' },
      { status: 500 }
    )
  }
}

// DELETE - Delete step
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Step ID is required' },
        { status: 400 }
      )
    }

    await prisma.howItWorksStep.delete({
      where: { id },
    })

    revalidateTag('how-it-works')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting how it works step:', error)
    return NextResponse.json(
      { error: 'Failed to delete how it works step' },
      { status: 500 }
    )
  }
}
