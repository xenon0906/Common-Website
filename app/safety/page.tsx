import { getSafetyContent, getImagesConfig } from '@/lib/content'
import SafetyPageClient from './SafetyPageClient'

export default async function SafetyPage() {
  const [safety, images] = await Promise.all([
    getSafetyContent(),
    getImagesConfig(),
  ])

  return <SafetyPageClient safety={safety} images={images} />
}
