'use client'

import { LegalPageLayout } from '@/components/shared/LegalPageLayout'
import { TERMS_OF_SERVICE } from '@/lib/legal-content'

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      badge="Terms of Service"
      title="Terms &"
      titleHighlight="Conditions"
      description="The legal agreement governing your use of Snapgo's ride-sharing platform."
      lastUpdated={TERMS_OF_SERVICE.lastUpdated}
      sections={TERMS_OF_SERVICE.sections}
    />
  )
}
