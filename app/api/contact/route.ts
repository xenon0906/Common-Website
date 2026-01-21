import { NextRequest, NextResponse } from 'next/server'

// Google Apps Script Web App URL - set this in your environment variables
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // If Google Script URL is configured, send to Google Sheets
    if (GOOGLE_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString(),
            source: 'snapgo-website',
          }),
        })

        if (!response.ok) {
          console.error('Google Sheets error:', await response.text())
          // Don't fail the request if Google Sheets fails
          // The form submission should still succeed
        }
      } catch (googleError) {
        console.error('Failed to send to Google Sheets:', googleError)
        // Continue without failing - log the error but don't block the user
      }
    } else {
      console.warn('GOOGLE_SCRIPT_URL not configured - form data not saved to Google Sheets')
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
