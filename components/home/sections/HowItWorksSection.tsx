'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Calendar, MapPin, Users, Car, Wallet } from 'lucide-react'

const realtimeSteps = [
  { step: 1, title: 'Enter Destination', description: 'Open the app and tell us where you need to go.', icon: MapPin },
  { step: 2, title: 'Match Instantly', description: 'We find verified riders near you heading the same way.', icon: Users },
  { step: 3, title: 'Ride & Save', description: 'Share the cab, split the fare. Save up to 75%.', icon: Wallet },
]

const scheduleSteps = [
  { step: 1, title: 'Plan Your Trip', description: 'Set your date, time, and route in advance.', icon: Calendar },
  { step: 2, title: 'Get Matched', description: 'We pair you with co-travellers on the same schedule.', icon: Users },
  { step: 3, title: 'Ride Together', description: 'Your cab is confirmed. Show up and go.', icon: Car },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-[#fafbfd]">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
            Two ways to ride. Both save you money.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* Realtime */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-7 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Realtime Ride</h3>
            </div>

            <div className="space-y-6">
              {realtimeSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0e4493] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                      {item.step}
                    </div>
                    {index < realtimeSteps.length - 1 && (
                      <div className="w-px flex-1 bg-[#0e4493]/15 mt-2" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-7 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Schedule Ride</h3>
            </div>

            <div className="space-y-6">
              {scheduleSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#0e4493] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                      {item.step}
                    </div>
                    {index < scheduleSteps.length - 1 && (
                      <div className="w-px flex-1 bg-[#0e4493]/15 mt-2" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
