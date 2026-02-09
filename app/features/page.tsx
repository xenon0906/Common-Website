import { getFeaturesPageData } from '@/lib/content'
import { SiteLayout } from '@/components/layout/SiteLayout'
import FeaturesPageClient from './FeaturesPageClient'

export default async function FeaturesPage() {
  const features = await getFeaturesPageData()

  return (
    <SiteLayout hideFooter>
      <FeaturesPageClient features={features} />
    </SiteLayout>
  )
}
