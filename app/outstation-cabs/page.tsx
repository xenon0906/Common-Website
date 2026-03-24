import type { Metadata } from 'next'
import OutstationCabsClient from './OutstationCabsClient'

export const metadata: Metadata = {
  title: 'Outstation Cabs — Name Your Price | Snapgo',
  description: 'Book outstation cabs on Snapgo — name your own price, choose from 5 vehicle types, get transparent per-km pricing. 10% off round trips. Sedan to Tempo Traveller.',
}

export default function OutstationCabsPage() {
  return <OutstationCabsClient />
}
