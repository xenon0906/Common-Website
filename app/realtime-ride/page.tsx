import type { Metadata } from 'next'
import RealtimeRideClient from './RealtimeRideClient'

export const metadata: Metadata = {
  title: 'Realtime Ride — Find Co-Riders Instantly | Snapgo',
  description: 'Find co-riders in real-time on Snapgo. Open the map, set your destination, and instantly match with people heading the same way. Split cab fares on the spot.',
}

export default function RealtimeRidePage() {
  return <RealtimeRideClient />
}
