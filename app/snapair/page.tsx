import type { Metadata } from 'next'
import SnapAirClient from './SnapAirClient'

export const metadata: Metadata = {
  title: 'SnapAir — Shared Airport Cabs to Delhi IGI | Snapgo',
  description: 'Shared airport cab transfers to Delhi IGI Airport — T1, T2 & T3. Save 50% on airport rides. Driver confirmed 24 hours before pickup.',
}

export default function SnapAirPage() {
  return <SnapAirClient />
}
