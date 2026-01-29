'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Loader2, Sparkles, Target, BarChart3 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface KeywordAnalyzerProps {
  onSuggestKeywords?: (content: string) => Promise<string[]>
}

export function KeywordAnalyzer({ onSuggestKeywords }: KeywordAnalyzerProps) {
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [keywordResults, setKeywordResults] = useState<{
    keyword: string
    count: number
    density: number
  }[]>([])
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])

  const analyzeContent = () => {
    if (!content.trim()) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      const words = content.toLowerCase().match(/\b[a-z]+\b/g) || []
      const wordCount = words.length

      // Count word frequency
      const wordFrequency: Record<string, number> = {}
      words.forEach(word => {
        if (word.length > 3) { // Ignore short words
          wordFrequency[word] = (wordFrequency[word] || 0) + 1
        }
      })

      // Convert to array and sort by frequency
      const results = Object.entries(wordFrequency)
        .map(([keyword, count]) => ({
          keyword,
          count,
          density: Math.round((count / wordCount) * 100 * 100) / 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15)

      setKeywordResults(results)
      setIsAnalyzing(false)
    }, 1000)
  }

  const handleSuggestKeywords = async () => {
    if (!onSuggestKeywords || !content.trim()) return

    setIsAnalyzing(true)
    try {
      const suggestions = await onSuggestKeywords(content)
      setSuggestedKeywords(suggestions)
    } catch (error) {
      console.error('Error suggesting keywords:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getDensityColor = (density: number) => {
    if (density > 3) return 'text-red-500'
    if (density > 2) return 'text-yellow-500'
    if (density >= 1) return 'text-green-500'
    return 'text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Keyword Density Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your content to find keyword density and opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content to Analyze</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Paste your content here to analyze keyword density..."
            />
            <p className="text-xs text-muted-foreground">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={analyzeContent} disabled={isAnalyzing || !content.trim()}>
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4 mr-2" />
              )}
              Analyze Keywords
            </Button>

            {onSuggestKeywords && (
              <Button
                variant="outline"
                onClick={handleSuggestKeywords}
                disabled={isAnalyzing || !content.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Suggest
              </Button>
            )}
          </div>

          {/* Results */}
          {keywordResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t"
            >
              <h3 className="font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Keyword Analysis Results
              </h3>

              <div className="space-y-2">
                {keywordResults.map((result, index) => (
                  <motion.div
                    key={result.keyword}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-6 text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span className="font-medium">{result.keyword}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {result.count}x
                      </span>
                      <div className="w-24">
                        <Progress
                          value={Math.min(result.density * 20, 100)}
                          className="h-2"
                        />
                      </div>
                      <span className={`text-sm font-medium w-16 text-right ${getDensityColor(result.density)}`}>
                        {result.density}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Recommended density:</strong> 1-2% for primary keywords, 0.5-1% for secondary keywords.
                  Keywords above 3% may be considered keyword stuffing by search engines.
                </p>
              </div>
            </motion.div>
          )}

          {/* AI Suggested Keywords */}
          {suggestedKeywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t"
            >
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Suggested Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Keyword Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Include primary keywords in the title, first paragraph, and headings
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use variations and synonyms to avoid keyword stuffing
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Target long-tail keywords for more specific search intent
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Include keywords naturally in image alt text and URLs
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Focus on user intent rather than exact match keywords
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
