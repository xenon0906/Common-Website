'use client'

import { useState, useEffect } from 'react'
import { LegalPageLayout } from '@/components/shared/LegalPageLayout'
import { PRIVACY_POLICY } from '@/lib/legal-content'

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState(PRIVACY_POLICY)

  useEffect(() => {
    fetch('/api/content/legal?type=privacy')
      .then(res => res.json())
      .then(data => {
        if (data?.sections?.length) setContent(data)
      })
      .catch(() => {})
  }, [])

  return (
    <LegalPageLayout
      badge="Privacy Policy"
      title="Your Privacy"
      titleHighlight="Matters"
      description="How we collect, use, and protect your personal information at Snapgo."
      lastUpdated={content.lastUpdated}
      sections={content.sections}
    />
  )
}
