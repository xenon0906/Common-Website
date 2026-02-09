import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'
import {
  getFirestoreCollection,
  isFirebaseConfigured,
  getAdminFirestore,
  getCollectionPath,
} from '@/lib/firebase-server'
import { DEFAULT_TEAM, TeamMemberData } from '@/lib/content'

// GET - Fetch all team members from Firestore
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    if (!isFirebaseConfigured()) {
      // Return defaults if Firebase not configured
      const filteredTeam = includeInactive
        ? DEFAULT_TEAM
        : DEFAULT_TEAM.filter(m => m.isActive !== false)
      return NextResponse.json(filteredTeam)
    }

    const teamMembers = await getFirestoreCollection<TeamMemberData>('team', DEFAULT_TEAM, 'order')

    const filteredMembers = includeInactive
      ? teamMembers
      : teamMembers.filter(m => m.isActive !== false)

    return NextResponse.json(filteredMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    // Return defaults on error
    return NextResponse.json(DEFAULT_TEAM.filter(m => m.isActive !== false), { status: 200 })
  }
}

// POST - Create a new team member in Firestore
export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req, 'team', { maxRequests: 10, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { name, bio, details, imageUrl, portraitUrl, email, linkedin, twitter, order, role, category } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('team')
    const collRef = db.collection(collectionPath)

    // Get the highest order number if not provided
    let memberOrder = order
    if (memberOrder === undefined) {
      const snapshot = await collRef.orderBy('order', 'desc').limit(1).get()
      if (!snapshot.empty) {
        const lastMember = snapshot.docs[0].data()
        memberOrder = (lastMember.order || 0) + 1
      } else {
        memberOrder = 1
      }
    }

    const newMemberData: Omit<TeamMemberData, 'id'> = {
      name,
      role: role || '',
      category: category || 'team',
      bio: bio || '',
      details: details || '',
      imageUrl: imageUrl || '',
      portraitUrl: portraitUrl || '',
      email: email || '',
      linkedin: linkedin || '',
      twitter: twitter || '',
      order: memberOrder,
      isActive: true,
    }

    const docRef = await collRef.add(newMemberData)

    const teamMember: TeamMemberData = {
      id: docRef.id,
      ...newMemberData,
    }

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
