'use client'

import { useState, useEffect } from 'react'
import { LegalPageLayout } from '@/components/shared/LegalPageLayout'
import { REFUND_POLICY } from '@/lib/legal-content'

export default function RefundPolicyPage() {
  const [content, setContent] = useState(REFUND_POLICY)

  useEffect(() => {
    fetch('/api/content/legal?type=refund')
      .then(res => res.json())
      .then(data => {
        if (data?.sections?.length) setContent(data)
      })
      .catch(() => {})
  }, [])

  return (
    <LegalPageLayout
      badge="Refund Policy"
      title="Refund &"
      titleHighlight="Cancellation"
      description="Clear, fair policies for cancellations and refunds on Snapgo."
      lastUpdated={content.lastUpdated}
      sections={content.sections}
    />
  )
}
