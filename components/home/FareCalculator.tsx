'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calculator, Users, IndianRupee, TrendingDown, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FareCalculator() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [totalFare, setTotalFare] = useState(400)
  const [riders, setRiders] = useState(4)

  const calculations = useMemo(() => {
    const perPerson = Math.round(totalFare / riders)
    const savings = totalFare - perPerson
    const savingsPercent = Math.round((savings / totalFare) * 100)
    return { perPerson, savings, savingsPercent }
  }, [totalFare, riders])

  // Pie chart segments
  const pieSegments = useMemo(() => {
    const segments = []
    let startAngle = 0
    for (let i = 0; i < riders; i++) {
      const angle = 360 / riders
      segments.push({
        startAngle,
        endAngle: startAngle + angle,
        color: i === 0 ? '#0e4493' : `hsl(${213 + i * 20}, 72%, ${32 + i * 10}%)`,
      })
      startAngle += angle
    }
    return segments
  }, [riders])

  return (
    <section ref={containerRef} className="py-20 bg-background">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See Your <span className="text-primary">Savings</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate how much you can save by sharing your ride with snapgo.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Input section */}
                  <div className="p-4 sm:p-6 md:p-8 bg-muted/50">
                    <div className="space-y-8">
                      {/* Total fare slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            Total Cab Fare
                          </Label>
                          <span className="text-2xl font-bold text-primary">₹{totalFare}</span>
                        </div>
                        <Slider
                          value={totalFare}
                          onValueChange={setTotalFare}
                          min={100}
                          max={2000}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>₹100</span>
                          <span>₹2000</span>
                        </div>
                      </div>

                      {/* Riders selector */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          Number of Riders
                        </Label>
                        <div className="flex gap-2">
                          {[2, 3, 4].map((num) => (
                            <Button
                              key={num}
                              variant={riders === num ? 'default' : 'outline'}
                              className={cn(
                                'flex-1 h-10 sm:h-12 text-base sm:text-lg font-bold',
                                riders === num && 'bg-primary text-white hover:bg-primary/90'
                              )}
                              onClick={() => setRiders(num)}
                            >
                              {num}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results section */}
                  <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '30px 30px'
                      }} />
                    </div>

                    <div className="relative z-10 space-y-6">
                      {/* Pie chart visualization */}
                      <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            {pieSegments.map((segment, i) => {
                              const radius = 40
                              const circumference = 2 * Math.PI * radius
                              const segmentLength = (segment.endAngle - segment.startAngle) / 360 * circumference
                              const offset = segment.startAngle / 360 * circumference
                              return (
                                <circle
                                  key={i}
                                  cx="50"
                                  cy="50"
                                  r={radius}
                                  fill="none"
                                  stroke={segment.color}
                                  strokeWidth="20"
                                  strokeDasharray={`${segmentLength} ${circumference}`}
                                  strokeDashoffset={-offset}
                                  className="transition-all duration-500"
                                />
                              )
                            })}
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{riders}</div>
                              <div className="text-xs text-white/90">riders</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Results */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${totalFare}-${riders}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="text-center">
                            <div className="text-white/90 text-xs sm:text-sm mb-1">You pay only</div>
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
                              ₹{calculations.perPerson}
                            </div>
                            <div className="text-white/90 text-xs sm:text-sm mt-1">
                              instead of ₹{totalFare}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/10 rounded-xl">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                            <div>
                              <span className="text-lg sm:text-xl md:text-2xl font-bold text-accent">
                                ₹{calculations.savings}
                              </span>
                              <span className="text-white text-sm sm:text-base ml-1 sm:ml-2">saved</span>
                            </div>
                            <span className="px-2 sm:px-3 py-1 bg-accent text-dark text-xs sm:text-sm font-bold rounded-full">
                              {calculations.savingsPercent}% OFF
                            </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Savings example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Monthly savings:</span> Using snapgo just 20 times a month, you could save{' '}
              <span className="text-primary font-bold">₹{calculations.savings * 20}</span>!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
