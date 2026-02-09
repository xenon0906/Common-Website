import { getHowItWorksDetailed, getHowItWorksComparisons, getImagesConfig } from '@/lib/content'
import HowItWorksClient from './HowItWorksClient'

export default async function HowItWorksPage() {
  const [allSteps, comparisons, images] = await Promise.all([
    getHowItWorksDetailed(),
    getHowItWorksComparisons(),
    getImagesConfig(),
  ])

  const realTimeSteps = allSteps.filter(s => s.mode === 'realtime')
  const scheduledSteps = allSteps.filter(s => s.mode === 'scheduled')

  return (
    <HowItWorksClient
      realTimeSteps={realTimeSteps}
      scheduledSteps={scheduledSteps}
      comparisons={comparisons}
      images={images}
    />
  )
}
