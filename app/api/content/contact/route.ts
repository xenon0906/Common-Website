import { NextResponse } from 'next/server'
import { getFirestoreDocument, isFirebaseConfigured } from '@/lib/firebase-server'
import { DEFAULT_CONTACT } from '@/lib/content'

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
    return NextResponse.json(DEFAULT_CONTACT, { status: 200 })
  }
}
