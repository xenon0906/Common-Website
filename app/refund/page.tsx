'use client'

import { LegalPageLayout } from '@/components/shared/LegalPageLayout'
import { REFUND_POLICY } from '@/lib/legal-content'

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      badge="Refund Policy"
      title="Refund &"
      titleHighlight="Cancellation"
      description="Clear, fair policies for cancellations and refunds on Snapgo."
      lastUpdated={REFUND_POLICY.lastUpdated}
      sections={REFUND_POLICY.sections}
    />
  )
}
