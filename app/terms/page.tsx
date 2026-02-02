'use client'

import { useState, useEffect } from 'react'
import { LegalPageLayout } from '@/components/shared/LegalPageLayout'
import { TERMS_OF_SERVICE } from '@/lib/legal-content'

export default function TermsOfServicePage() {
  const [content, setContent] = useState(TERMS_OF_SERVICE)

  useEffect(() => {
    fetch('/api/content/legal?type=terms')
      .then(res => res.json())
      .then(data => {
        if (data?.sections?.length) setContent(data)
      })
      .catch(() => {})
  }, [])

  return (
    <LegalPageLayout
      badge="Terms of Service"
      title="Terms &"
      titleHighlight="Conditions"
      description="The legal agreement governing your use of Snapgo's ride-sharing platform."
      lastUpdated={content.lastUpdated}
      sections={content.sections}
    />
  )
}
