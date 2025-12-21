import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// GET - Fetch a single team member
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PUT - Update a team member
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await req.json()
    const { name, bio, details, imageUrl, portraitUrl, email, linkedin, twitter, order, isActive } = body

    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name: name ?? existingMember.name,
        bio: bio !== undefined ? bio : existingMember.bio,
        details: details !== undefined ? details : existingMember.details,
        imageUrl: imageUrl !== undefined ? imageUrl : existingMember.imageUrl,
        portraitUrl: portraitUrl !== undefined ? portraitUrl : existingMember.portraitUrl,
        email: email !== undefined ? email : existingMember.email,
        linkedin: linkedin !== undefined ? linkedin : existingMember.linkedin,
        twitter: twitter !== undefined ? twitter : existingMember.twitter,
        order: order ?? existingMember.order,
        isActive: isActive ?? existingMember.isActive,
      },
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    await prisma.teamMember.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
