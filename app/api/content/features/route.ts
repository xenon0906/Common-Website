import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

// GET - Fetch all features
export async function GET() {
  try {
    const features = await prisma.feature.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    if (features.length === 0) {
      return NextResponse.json([
        { id: '1', title: 'Save Up to 75%', description: 'Share cab fares and save significant money on your daily commute', icon: 'Wallet', order: 1, isActive: true },
        { id: '2', title: 'Aadhaar Verified', description: 'All users verified via Aadhaar KYC powered by DigiLocker', icon: 'ShieldCheck', order: 2, isActive: true },
        { id: '3', title: 'Female-Only Option', description: 'Women can connect only with verified female riders for added safety', icon: 'Users', order: 3, isActive: true },
        { id: '4', title: 'Real-time & Scheduled', description: 'Find rides instantly or plan ahead for your convenience', icon: 'Clock', order: 4, isActive: true },
        { id: '5', title: 'Eco-Friendly', description: 'Reduce carbon footprint by sharing rides with fellow travelers', icon: 'Leaf', order: 5, isActive: true },
        { id: '6', title: 'Smart Matching', description: 'Advanced algorithm matches within 750m radius for perfect routes', icon: 'MapPin', order: 6, isActive: true },
      ])
    }

    return NextResponse.json(features)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    )
  }
}

// POST - Create new feature
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { title, description, icon, order, isActive } = body

    const feature = await prisma.feature.create({
      data: {
        title,
        description,
        icon: icon || 'Star',
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('features')
    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    console.error('Error creating feature:', error)
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    )
  }
}

// PUT - Update feature
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, title, description, icon, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Feature ID is required' },
        { status: 400 }
      )
    }

    const feature = await prisma.feature.update({
      where: { id },
      data: {
        title,
        description,
        icon: icon || 'Star',
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('features')
    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    )
  }
}

// DELETE - Delete feature
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Feature ID is required' },
        { status: 400 }
      )
    }

    await prisma.feature.delete({
      where: { id },
    })

    revalidateTag('features')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    )
  }
}
