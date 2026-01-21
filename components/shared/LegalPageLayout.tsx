'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
  content: React.ReactNode
}

interface LegalPageLayoutProps {
  badge: string
  title: string
  titleHighlight: string
  description: string
  lastUpdated: string
  sections: Section[]
}

export function LegalPageLayout({
  badge,
  title,
  titleHighlight,
  description,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  const [tocOpen, setTocOpen] = useState(false)

  // Track scroll position for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setTocOpen(false)
    }
  }

  return (
    <SiteLayout>
      <PageHero
        badge={badge}
        title={title}
        titleHighlight={titleHighlight}
        description={description}
      />

      {/* Last Updated Banner */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-6xl mx-auto">
          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {sections.map((section, index) => (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.1 }}
                      >
                        <span className="mr-2 text-xs opacity-50">{index + 1}.</span>
                        {section.title}
                      </motion.button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Mobile TOC Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="w-full flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <span className="font-medium">Table of Contents</span>
              {tocOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <motion.div
              initial={false}
              animate={{ height: tocOpen ? 'auto' : 0, opacity: tocOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <nav className="p-4 space-y-2 bg-muted/50 rounded-b-lg">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="mr-2 text-xs opacity-50">{index + 1}.</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Content */}
          <main className="lg:col-start-2">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <h2 className="text-xl md:text-2xl font-bold">{section.title}</h2>
                      </div>
                      <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
                        {section.content}
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-teal/5 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-2">Questions about this policy?</h3>
                  <p className="text-muted-foreground mb-4">
                    Contact us at{' '}
                    <a href="mailto:info@snapgo.co.in" className="text-primary hover:underline">
                      info@snapgo.co.in
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Snapgo Service Private Limited<br />
                    Block 45, Sharda University, Knowledge Park 3<br />
                    Greater Noida, Uttar Pradesh, India
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </SiteLayout>
  )
}
