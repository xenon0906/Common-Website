'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
  twitter?: string
  youtube?: string
}

interface ContactInfo {
  email: string
  phone: string
  address: string
  supportEmail?: string
  businessEmail?: string
}

interface SiteSettings {
  site?: {
    name?: string
    legalName?: string
    tagline?: string
    description?: string
  }
}

const DEFAULT_WHITE_LOGO = '/images/logo/Snapgo%20Logo%20White.png'

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Features', href: '/features' },
    { label: 'Safety', href: '/safety' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Support', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
}

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2025)
  const [social, setSocial] = useState<SocialLinks>(SITE_CONFIG.social)
  const [contact, setContact] = useState<ContactInfo>({
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    address: SITE_CONFIG.address,
  })
  const [siteInfo, setSiteInfo] = useState({
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    description: SITE_CONFIG.description,
  })
  const [logoUrl, setLogoUrl] = useState(DEFAULT_WHITE_LOGO)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())

    // Fetch social links from API
    fetch('/api/content/social')
      .then(res => res.json())
      .then((data: SocialLinks) => {
        if (data) setSocial(data)
      })
      .catch(() => {
        // Keep defaults on error
      })

    // Fetch contact info from API
    fetch('/api/content/contact')
      .then(res => res.json())
      .then((data: ContactInfo) => {
        if (data) setContact(data)
      })
      .catch(() => {
        // Keep defaults on error
      })

    // Fetch site settings from API
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then((data: SiteSettings) => {
        if (data?.site) {
          setSiteInfo({
            name: data.site.name || SITE_CONFIG.name,
            legalName: data.site.legalName || SITE_CONFIG.legalName,
            description: data.site.description || SITE_CONFIG.description,
          })
        }
      })
      .catch(() => {
        // Keep defaults on error
      })

    // Fetch dynamic logo from images API
    fetch('/api/content/images')
      .then(res => res.json())
      .then(data => {
        if (data?.logos?.white) {
          setLogoUrl(data.logos.white)
        }
      })
      .catch(() => {
        // Keep default on error
      })
  }, [])

  // Build social links array from state
  const socialLinks = [
    { icon: Facebook, href: social.facebook, label: 'Facebook' },
    { icon: Instagram, href: social.instagram, label: 'Instagram' },
    { icon: Linkedin, href: social.linkedin, label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-10 sm:py-12 md:py-16">
        {/* Mobile: Centered brand section */}
        <div className="flex flex-col items-center text-center mb-10 md:hidden">
          <Link href="/" className="inline-block mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-16 h-16"
            >
              <Image
                src={logoUrl}
                alt={siteInfo.name}
                fill
                className="object-contain"
              />
            </motion.div>
          </Link>
          <p className="text-white/70 text-sm mb-5 max-w-xs leading-relaxed">
            {siteInfo.description}
          </p>
          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile: 2-column grid for links */}
        <div className="grid grid-cols-2 gap-6 mb-8 md:hidden">
          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: Contact section */}
        <div className="md:hidden border-t border-white/10 pt-6">
          <h3 className="text-sm font-semibold mb-4 text-center text-white">Contact Us</h3>
          <div className="flex flex-col items-center gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>{contact.email}</span>
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>{contact.phone}</span>
            </a>
            <div className="inline-flex items-start gap-1 text-white/60 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-center">{contact.address}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-28 h-28 lg:w-32 lg:h-32"
              >
                <Image
                  src={logoUrl}
                  alt={siteInfo.name}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </Link>
            <p className="text-white/70 mb-6 max-w-sm">
              {siteInfo.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-sm">{contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-sm">{contact.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certifications Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-[11px] sm:text-xs font-semibold">
                DPIIT Certified
              </span>
              <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-[11px] sm:text-xs font-semibold">
                Startup India
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[11px] sm:text-xs font-semibold">
                Startup Uttarakhand
              </span>
            </div>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-[11px] sm:text-xs text-white/50">{siteInfo.legalName}</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-4">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
            <p className="text-[11px] sm:text-xs text-white/50">© {currentYear} {siteInfo.name}. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] sm:text-xs text-white/50 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
