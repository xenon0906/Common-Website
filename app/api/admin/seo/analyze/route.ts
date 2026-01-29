import { NextRequest, NextResponse } from 'next/server'
import { calculateSEOScore, PageSEO, SEOAnalysisResult } from '@/lib/types/seo'
import { requireAuth } from '@/lib/api-auth'

// POST /api/admin/seo/analyze - Analyze SEO for given content
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const data = await request.json() as Partial<PageSEO>

    const analysis = calculateSEOScore(data)

    // Add additional analysis
    const extendedAnalysis: SEOAnalysisResult & { tips: string[] } = {
      ...analysis,
      tips: [],
    }

    // Title tips
    const titleLength = data.metaTitle?.length || 0
    if (titleLength > 0 && titleLength < 50) {
      extendedAnalysis.tips.push('Consider adding more descriptive words to your title')
    }
    if (data.metaTitle && !data.metaTitle.includes('|') && !data.metaTitle.includes('-')) {
      extendedAnalysis.tips.push('Consider adding your brand name separated by | or -')
    }

    // Description tips
    const descLength = data.metaDescription?.length || 0
    if (descLength > 0 && descLength < 140) {
      extendedAnalysis.tips.push('Add more detail to your meta description to maximize search visibility')
    }

    // Keyword tips
    const keywordCount = data.keywords?.length || 0
    if (keywordCount > 0 && keywordCount < 5) {
      extendedAnalysis.tips.push('Consider adding more relevant keywords (aim for 5-8)')
    }

    // OG Image
    if (!data.ogImage) {
      extendedAnalysis.tips.push('Add an Open Graph image for better social media visibility')
    }

    // Schema
    if (!data.schemaType) {
      extendedAnalysis.tips.push('Add structured data (JSON-LD) to improve rich snippets in search results')
    }

    // Check for action words in title
    const actionWords = ['get', 'learn', 'discover', 'find', 'start', 'join', 'save', 'best', 'top', 'how']
    const titleLower = (data.metaTitle || '').toLowerCase()
    const hasActionWord = actionWords.some(word => titleLower.includes(word))
    if (!hasActionWord && titleLength > 0) {
      extendedAnalysis.tips.push('Consider using action words in your title to improve click-through rate')
    }

    return NextResponse.json(extendedAnalysis)
  } catch (error) {
    console.error('Error analyzing SEO:', error)
    return NextResponse.json(
      { error: 'Failed to analyze SEO' },
      { status: 500 }
    )
  }
}
