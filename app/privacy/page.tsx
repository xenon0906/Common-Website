'use client'

import { LegalPageLayout } from '@/components/shared/LegalPageLayout'
import { PRIVACY_POLICY } from '@/lib/legal-content'

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      badge="Privacy Policy"
      title="Your Privacy"
      titleHighlight="Matters"
      description="How we collect, use, and protect your personal information at Snapgo."
      lastUpdated={PRIVACY_POLICY.lastUpdated}
      sections={PRIVACY_POLICY.sections}
    />
  )
}
