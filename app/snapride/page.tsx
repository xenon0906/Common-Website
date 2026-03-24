import type { Metadata } from 'next'
import SnapRideClient from './SnapRideClient'

export const metadata: Metadata = {
  title: 'SnapRide — Micro Cab Shuttle for College Students | Snapgo',
  description: 'SnapRide micro cab shuttles for Greater Noida colleges — fixed routes from ₹80/ride. AC cabs, WiFi, GPS tracking. Cheaper than college buses.',
}

export default function SnapRidePage() {
  return <SnapRideClient />
}
