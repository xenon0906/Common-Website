import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// GET - Fetch all team members
// Use ?includeInactive=true to include inactive members (for admin panel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const teamMembers = await prisma.teamMember.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST - Create a new team member
export async function POST(req: NextRequest) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await req.json()
    const { name, bio, details, imageUrl, portraitUrl, email, linkedin, twitter, order } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Get the highest order number if not provided
    let memberOrder = order
    if (memberOrder === undefined) {
      const lastMember = await prisma.teamMember.findFirst({
        orderBy: { order: 'desc' },
      })
      memberOrder = lastMember ? lastMember.order + 1 : 1
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        bio: bio || null,
        details: details || null,
        imageUrl: imageUrl || null,
        portraitUrl: portraitUrl || null,
        email: email || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        order: memberOrder,
        isActive: true,
      },
    })

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
