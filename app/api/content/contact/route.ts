import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured, getAdminFirestore, getCollectionPath } from '@/lib/firebase-server'
import { DEFAULT_CONTACT } from '@/lib/content'
import { requireAuth } from '@/lib/api-auth'

interface ContactInfo {
  email: string
  phone: string
  address: string
  supportEmail?: string
  businessEmail?: string
}

const DEFAULT_CONTACT_DOC: ContactInfo = {
  email: DEFAULT_CONTACT.email,
  phone: DEFAULT_CONTACT.phone,
  address: DEFAULT_CONTACT.address,
  supportEmail: 'support@snapgo.co.in',
  businessEmail: 'business@snapgo.co.in',
}

// GET - Fetch contact info from Firestore or return defaults
export async function GET() {
  try {
    // If Firebase is configured, try to fetch from Firestore
    if (isFirebaseConfigured()) {
      const contact = await getFirestoreDocument<ContactInfo>(
        'content',
        'contact',
        DEFAULT_CONTACT_DOC
      )
      return NextResponse.json(contact)
    }

    // Otherwise return static defaults
    return NextResponse.json(DEFAULT_CONTACT)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(DEFAULT_CONTACT, {
      status: 200,
      headers: { 'X-Data-Source': 'fallback' },
    })
  }
}

// PUT - Update contact info in Firestore
export async function PUT(req: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const data = await req.json()
    const db = getAdminFirestore()
    const docPath = getCollectionPath('content')

    await db.collection(docPath).doc('contact').set(data, { merge: true })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}
