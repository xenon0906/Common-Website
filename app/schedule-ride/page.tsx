import type { Metadata } from 'next'
import ScheduleRideClient from './ScheduleRideClient'

export const metadata: Metadata = {
  title: 'Schedule Ride — Plan Trips in Advance | Snapgo',
  description: 'Schedule rides ahead of time on Snapgo. Set your route, date, seats, and find verified co-riders going your way. Save up to 75% on cab fares.',
}

export default function ScheduleRidePage() {
  return <ScheduleRideClient />
}
