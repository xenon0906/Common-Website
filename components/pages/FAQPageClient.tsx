'use client'

import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { PageHero } from '@/components/shared/PageHero'
import { FAQAccordion } from '@/components/shared/FAQAccordion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FAQData } from '@/lib/content'
import { useMemo } from 'react'

interface FAQPageClientProps {
  faqs: FAQData[]
}

export function FAQPageClient({ faqs }: FAQPageClientProps) {
  // Extract unique categories from FAQs and map to FAQAccordion format
  const categories = useMemo(() => {
    const cats = new Set(faqs.map(faq => faq.category))
    return Array.from(cats)
  }, [faqs])

  // Map FAQData to the format expected by FAQAccordion
  const faqItems = useMemo(() => {
    return faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    }))
  }, [faqs])

  return (
    <SiteLayout>
      <PageHero
        badge="FAQ"
        title="Frequently Asked"
        titleHighlight="Questions"
        description="Everything you need to know about Snapgo, ride-sharing, safety, and savings."
        icon={<HelpCircle className="w-5 h-5" />}
      />

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <FAQAccordion
            items={faqItems}
            categories={categories}
          />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-teal/5">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                <p className="text-muted-foreground mb-6">
                  Can&apos;t find the answer you&apos;re looking for? Our support team is here to help you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="gradient" asChild>
                    <Link href="/contact">
                      Contact Support
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:info@snapgo.co.in">
                      Email Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">Helpful Resources</h2>
            <p className="text-muted-foreground">Explore more about Snapgo</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'How It Works',
                description: 'Learn how to find and share rides',
                href: '/how-it-works',
              },
              {
                title: 'Safety Features',
                description: 'Discover our safety measures',
                href: '/safety',
              },
              {
                title: 'Features',
                description: 'Explore all Snapgo features',
                href: '/features',
              },
            ].map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link href={link.href}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                      <ArrowRight className="w-4 h-4 mx-auto mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
