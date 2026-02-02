'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong!</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>We apologize for the inconvenience.</p>
            <button
              onClick={() => reset()}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#0066B3', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
