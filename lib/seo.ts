import { Metadata } from 'next'
import { SITE_CONFIG } from './constants'
import { getSiteUrl } from './utils/url'

const siteUrl = getSiteUrl()

/**
 * Generate page-specific metadata for SEO
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  image = '/images/og-image.png',
  keywords = [],
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`
  const canonicalUrl = `${siteUrl}${path}`

  const defaultKeywords = [
    'snapgo',
    'cab pooling',
    'ride sharing',
    'carpool india',
    'save money travel',
    'eco-friendly commute',
    'verified riders',
    'split cab fare',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

/**
 * Page-specific SEO configurations
 */
export const PAGE_SEO = {
  home: {
    title: "India's #1 Cab Pooling Platform",
    description:
      "Pool commercial cabs with verified co-riders. Save up to 75% on daily commute, reduce emissions, and travel safely. 100% legal, eco-friendly cab pooling app.",
    keywords: ['cab pooling app', 'split cab fare', 'daily commute savings', 'green travel india'],
  },
  about: {
    title: 'About Us - Our Story & Mission',
    description:
      "Learn about Snapgo's journey from a simple idea to India's leading cab pooling platform. Founded by Mohit & Surya Purohit to make travel affordable, legal, and eco-friendly.",
    keywords: ['snapgo founders', 'cab pooling startup', 'indian startup', 'dpiit certified'],
    path: '/about',
  },
  features: {
    title: 'Features - Safe & Verified Cab Pooling',
    description:
      'Discover Snapgo features: Aadhaar KYC verification, female-only option, real-time matching, SOS emergency, and up to 75% savings. Safe, legal, eco-friendly.',
    keywords: ['verified cab pooling', 'female safety travel', 'aadhaar kyc app', 'sos feature'],
    path: '/features',
  },
  safety: {
    title: 'Safety Features - Verified & Secure Travel',
    description:
      'Your safety is our priority. Aadhaar KYC verification, female-only filter, emergency SOS, and verified profiles ensure secure cab pooling experience.',
    keywords: ['safe cab pooling', 'women safety travel', 'verified riders', 'emergency sos'],
    path: '/safety',
  },
  howItWorks: {
    title: 'How It Works - Pool a Cab in 3 Steps',
    description:
      'Pool a cab in 3 simple steps: Enter destination, find matches within 750m, and split the fare. Download Snapgo and start saving today.',
    keywords: ['how to pool cab', 'cab sharing steps', 'ride matching app'],
    path: '/how-it-works',
  },
  team: {
    title: 'Our Team - Meet the People Behind Snapgo',
    description:
      'Meet the passionate team building India\'s greenest commuting platform. From founders to developers, we\'re committed to making travel affordable for everyone.',
    keywords: ['snapgo team', 'startup team india', 'cab pooling founders'],
    path: '/team',
  },
  blog: {
    title: 'Blog - Tips, Updates & Travel Stories',
    description:
      'Read the latest from Snapgo: commuting tips, savings stories, sustainability insights, and platform updates. Stay informed about cab pooling in India.',
    keywords: ['cab pooling blog', 'commute tips', 'travel savings'],
    path: '/blog',
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description:
      'Have questions about Snapgo? Contact us for support, partnerships, or feedback. We\'re here to help you save on your daily commute.',
    keywords: ['contact snapgo', 'cab pooling support', 'snapgo help'],
    path: '/contact',
  },
  faq: {
    title: 'FAQ - Frequently Asked Questions',
    description:
      'Find answers to common questions about Snapgo cab pooling: how it works, safety features, pricing, and more.',
    keywords: ['cab pooling faq', 'snapgo questions', 'ride sharing help'],
    path: '/faq',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Read Snapgo\'s privacy policy to understand how we collect, use, and protect your personal information.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Read Snapgo\'s terms and conditions for using our cab pooling platform and mobile application.',
    path: '/terms',
  },
  refund: {
    title: 'Refund Policy',
    description:
      'Learn about Snapgo\'s refund and cancellation policies for cab pooling services.',
    path: '/refund',
  },
}

/**
 * Generate JSON-LD structured data for a page
 */
export function generatePageJsonLd(type: 'home' | 'about' | 'faq' | 'article', data?: any) {
  const baseOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/logo/Snapgo%20Logo%20Blue.png`,
    description: SITE_CONFIG.description,
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Block 45, Sharda University',
      addressLocality: 'Greater Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201310',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      email: SITE_CONFIG.email,
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.linkedin,
    ],
  }

  switch (type) {
    case 'home':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          baseOrg,
          {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${siteUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'MobileApplication',
            name: 'Snapgo',
            operatingSystem: 'ANDROID, IOS',
            applicationCategory: 'TravelApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.5',
              ratingCount: '1000',
            },
          },
        ],
      }

    case 'about':
      return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        mainEntity: baseOrg,
      }

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data?.faqs?.map((faq: { question: string; answer: string }) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })) || [],
      }

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data?.title,
        description: data?.description,
        image: data?.image,
        datePublished: data?.publishedAt,
        dateModified: data?.updatedAt,
        author: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
        },
        publisher: baseOrg,
      }

    default:
      return baseOrg
  }
}
