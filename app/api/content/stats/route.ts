import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

// GET - Fetch all statistics
export async function GET() {
  try {
    const stats = await prisma.statistic.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    if (stats.length === 0) {
      return NextResponse.json([
        { id: '1', label: 'App Downloads', value: 7000, prefix: '', suffix: '+', icon: 'Download', order: 1, isActive: true },
        { id: '2', label: 'Peak Daily Rides', value: 110, prefix: '', suffix: '+', icon: 'Car', order: 2, isActive: true },
        { id: '3', label: 'Cost Savings', value: 75, prefix: '', suffix: '%', icon: 'Wallet', order: 3, isActive: true },
        { id: '4', label: 'Active Users', value: 400, prefix: '', suffix: '+', icon: 'Users', order: 4, isActive: true },
      ])
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

// POST - Create new statistic
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { label, value, prefix, suffix, icon, order, isActive } = body

    const stat = await prisma.statistic.create({
      data: {
        label,
        value: parseInt(value),
        prefix: prefix || '',
        suffix: suffix || '+',
        icon: icon || null,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('stats')
    return NextResponse.json(stat, { status: 201 })
  } catch (error) {
    console.error('Error creating statistic:', error)
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    )
  }
}

// PUT - Update statistic
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, label, value, prefix, suffix, icon, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Statistic ID is required' },
        { status: 400 }
      )
    }

    const stat = await prisma.statistic.update({
      where: { id },
      data: {
        label,
        value: parseInt(value),
        prefix: prefix || '',
        suffix: suffix || '+',
        icon: icon || null,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('stats')
    return NextResponse.json(stat)
  } catch (error) {
    console.error('Error updating statistic:', error)
    return NextResponse.json(
      { error: 'Failed to update statistic' },
      { status: 500 }
    )
  }
}

// DELETE - Delete statistic
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Statistic ID is required' },
        { status: 400 }
      )
    }

    await prisma.statistic.delete({
      where: { id },
    })

    revalidateTag('stats')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting statistic:', error)
    return NextResponse.json(
      { error: 'Failed to delete statistic' },
      { status: 500 }
    )
  }
}
