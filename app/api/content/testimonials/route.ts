import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

// GET - Fetch all testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    if (testimonials.length === 0) {
      return NextResponse.json([
        { id: '1', quote: 'Snapgo has saved me so much money! I used to spend Rs.400 for my daily commute, now I only pay Rs.100 by sharing with fellow students. Amazing concept!', author: 'Priya S.', role: 'College Student', location: 'Sharda University', avatarUrl: null, rating: 5, order: 1, isActive: true },
        { id: '2', quote: 'As a working professional, Snapgo has made my daily travel both affordable and social. I have made great connections with fellow commuters.', author: 'Rahul K.', role: 'IT Professional', location: 'Greater Noida', avatarUrl: null, rating: 5, order: 2, isActive: true },
        { id: '3', quote: 'The female-only option makes me feel safe. I can now travel without worrying about security while saving money.', author: 'Ananya M.', role: 'Graduate Student', location: 'Delhi NCR', avatarUrl: null, rating: 5, order: 3, isActive: true },
      ])
    }

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { quote, author, role, location, avatarUrl, rating, order, isActive } = body

    const testimonial = await prisma.testimonial.create({
      data: {
        quote,
        author,
        role: role || null,
        location: location || null,
        avatarUrl: avatarUrl || null,
        rating: rating || 5,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('testimonials')
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

// PUT - Update testimonial
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, quote, author, role, location, avatarUrl, rating, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        quote,
        author,
        role: role || null,
        location: location || null,
        avatarUrl: avatarUrl || null,
        rating: rating || 5,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    revalidateTag('testimonials')
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    await prisma.testimonial.delete({
      where: { id },
    })

    revalidateTag('testimonials')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
