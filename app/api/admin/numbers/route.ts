import { NextResponse } from 'next/server'
import { getFirebaseDb, getAppId } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = getFirebaseDb()
    const appId = getAppId()
    const numbersRef = doc(db, 'artifacts', appId, 'public', 'data', 'numbers', 'default')

    const numbersSnap = await getDoc(numbersRef)

    if (numbersSnap.exists()) {
      return NextResponse.json(numbersSnap.data())
    }

    // Return default data if none exists
    const defaultData = {
      stats: {
        totalRides: 50000,
        activeUsers: 10000,
        cities: 25,
        drivers: 5000,
      },
      pricing: {
        basePrice: 30,
        pricePerKm: 8,
        pricePerMinute: 1,
      },
      contact: {
        phone: '+91 9876543210',
        email: 'support@snapgo.co.in',
        address: 'Mumbai, Maharashtra, India',
      },
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(defaultData)
  } catch (error) {
    console.error('Error fetching numbers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch numbers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const db = getFirebaseDb()
    const appId = getAppId()
    const numbersRef = doc(db, 'artifacts', appId, 'public', 'data', 'numbers', 'default')

    await setDoc(numbersRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving numbers:', error)
    return NextResponse.json(
      { error: 'Failed to save numbers' },
      { status: 500 }
    )
  }
}
