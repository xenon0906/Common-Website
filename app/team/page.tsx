'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SiteLayout } from '@/components/layout/SiteLayout'
import {
  Users,
  Sparkles,
  Heart,
  Target,
  Rocket,
  Code,
  TrendingUp,
  Megaphone,
  Handshake,
  Globe,
  Lightbulb,
  CheckCircle,
  Zap,
  Award,
  Building,
  BriefcaseBusiness,
  Smartphone,
  BarChart3,
  Users2,
  Brain
} from 'lucide-react'
import Image from 'next/image'

// Team member data with detailed info
const teamMembers = [
  {
    name: 'Mohit Purohit',
    role: 'Founder & CTO',
    image: null, // Will add later
    highlights: [
      { icon: Rocket, text: 'Serial Entrepreneur: Started multiple businesses since Class 12th' },
      { icon: Smartphone, text: 'App Development Expert: Built, scaled, and successfully sold multiple mobile applications' },
      { icon: Users, text: 'Proven Leadership: Strong team management and collaboration skills with track record of profitable exits' },
      { icon: Code, text: 'Technical Vision: Drives product development and technology strategy for Snapgo' },
      { icon: TrendingUp, text: 'Business Acumen: Experience in building scalable business models and revenue streams' },
    ],
    gradient: 'from-primary via-blue-500 to-teal-500',
  },
  {
    name: 'Surya Prakash',
    role: 'Co-Founder & CEO',
    image: null,
    highlights: [
      { icon: Megaphone, text: 'Digital Marketing Specialist: Expert in Meta Ads, Google Ads, and performance marketing' },
      { icon: Handshake, text: 'Strategic Partnership: Long-term collaboration with Mohit across multiple ventures' },
      { icon: Globe, text: 'Network Builder: Extensive industry connections and partnership development capabilities' },
      { icon: TrendingUp, text: 'Growth Hacker: Proven ability to scale user acquisition and engagement' },
      { icon: BarChart3, text: 'Market Expansion: Experience in taking products to new markets and demographics' },
    ],
    gradient: 'from-teal-500 via-cyan-500 to-primary',
  },
  {
    name: 'Anurag Tiwari',
    role: 'Chief Marketing Officer (CMO)',
    image: null,
    highlights: [
      { icon: Building, text: 'Multi-Business Founder: Successfully launched and operated 2 independent businesses' },
      { icon: BriefcaseBusiness, text: 'Offline Marketing Expert: Deep knowledge of traditional marketing channels and customer acquisition' },
      { icon: Users2, text: 'Strategic Communications: Exceptional interpersonal skills and stakeholder management' },
      { icon: Lightbulb, text: 'Business Strategy: Strategic planning expertise for sustainable business growth' },
      { icon: Brain, text: 'Market Intelligence: Strong understanding of customer behavior and market dynamics' },
    ],
    gradient: 'from-violet-500 via-purple-500 to-primary',
  },
]

const teamStrengths = [
  {
    icon: Zap,
    title: 'Complementary Skills',
    description: 'Technical, marketing, and strategic expertise combined',
  },
  {
    icon: Rocket,
    title: 'Entrepreneurial DNA',
    description: 'All founders with hands-on business building experience',
  },
  {
    icon: Handshake,
    title: 'Proven Collaboration',
    description: 'Years of successful partnership and execution',
  },
  {
    icon: Target,
    title: 'Market Understanding',
    description: 'Deep insights into target demographics and user needs',
  },
  {
    icon: CheckCircle,
    title: 'Execution Focus',
    description: 'Track record of turning ideas into profitable, scalable businesses',
  },
]

// Hero section
function HeroSection() {
  return (
    <section className="hero-viewport bg-gradient-to-br from-primary via-primary/90 to-primary-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Meet the{' '}
            <span className="text-white/90">Team</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
            A passionate team of entrepreneurs dedicated to transforming urban mobility in India.
          </p>

          {/* Simple stats row */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { value: '10+', label: 'Team Members' },
              { value: '2025', label: 'Founded' },
              { value: '8.5K+', label: 'Users' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Individual team member section
function TeamMemberSection({
  member,
  index,
  isReversed
}: {
  member: typeof teamMembers[0]
  index: number
  isReversed: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className={`py-20 md:py-28 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
    >
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={isReversed ? 'lg:col-start-2' : ''}
          >
            <div className={`relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-to-br ${member.gradient}`}>
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[120px] font-bold text-white/20">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <div className="absolute bottom-8 left-8 right-8 text-center">
                    <p className="text-white/60 text-sm">Photo coming soon</p>
                  </div>
                </div>
              )}

              {/* Role badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                  {member.role}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={isReversed ? 'lg:col-start-1 lg:row-start-1' : ''}
          >
            <div className="max-w-xl">
              {/* Name and role */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {member.name}
              </h2>
              <p className="text-xl text-primary font-semibold mb-8">
                {member.role}
              </p>

              {/* Highlights */}
              <div className="space-y-4">
                {member.highlights.map((highlight, idx) => {
                  const Icon = highlight.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {highlight.text}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Team Strength section
function TeamStrengthSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary/90 to-teal-600">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Team Strength
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What Makes Us{' '}
            <span className="text-teal-300">Different</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Our combined expertise and shared vision drive Snapgo forward.
          </p>
        </motion.div>

        {/* Strengths grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teamStrengths.map((strength, index) => {
            const Icon = strength.icon
            return (
              <motion.div
                key={strength.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {strength.title}
                </h3>
                <p className="text-white/70">
                  {strength.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Company values section
function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const values = [
    {
      icon: Heart,
      title: 'User First',
      description: 'Every decision starts with our users. Their safety, savings, and satisfaction drive us.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We challenge the status quo and seek better solutions for urban mobility.',
      color: 'from-primary to-blue-500',
    },
    {
      icon: Sparkles,
      title: 'Transparency',
      description: 'Open communication, honest pricing, and clear expectations build trust.',
      color: 'from-teal-500 to-emerald-500',
    },
    {
      icon: Rocket,
      title: 'Impact',
      description: 'We measure success by the real difference we make in lives and the environment.',
      color: 'from-violet-500 to-purple-500',
    },
  ]

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Our Values
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Drives Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            The principles that guide every decision and shape our culture.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Join team CTA section
function JoinTeamSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8"
          >
            <Users className="w-10 h-10 text-primary" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our{' '}
            <span className="text-primary">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            We're always looking for passionate individuals who want to make a real difference in urban transportation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="mailto:careers@snapgo.co.in"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Send Resume
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {['Engineering', 'Design', 'Marketing', 'Operations'].map((dept) => (
              <span
                key={dept}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm"
              >
                {dept}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function TeamPage() {
  return (
    <SiteLayout>
      <HeroSection />

      {/* Team Member Sections */}
      {teamMembers.map((member, index) => (
        <TeamMemberSection
          key={member.name}
          member={member}
          index={index}
          isReversed={index % 2 !== 0}
        />
      ))}

      {/* Team Strength Section */}
      <TeamStrengthSection />

      {/* Values Section */}
      <ValuesSection />

      {/* Join Team CTA */}
      <JoinTeamSection />
    </SiteLayout>
  )
}
