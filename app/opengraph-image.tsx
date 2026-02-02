import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Snapgo - Pool Cabs, Save Money, Go Green'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0066B3',
          backgroundImage: 'linear-gradient(135deg, #0066B3 0%, #0d9488 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Snapgo
          </h1>
          <p
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.85)',
              marginTop: 16,
            }}
          >
            Pool Cabs, Save Money, Go Green
          </p>
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 40,
            }}
          >
            {['75% Savings', 'KYC Verified', 'Eco-Friendly'].map((text) => (
              <div
                key={text}
                style={{
                  padding: '8px 20px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: 20,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
