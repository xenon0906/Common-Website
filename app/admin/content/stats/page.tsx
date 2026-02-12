'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { contentAPI } from '@/lib/admin-client'
import { useToast } from '@/components/ui/use-toast'

interface Statistic {
  id: string
  label: string
  value: number
  prefix: string
  suffix: string
  icon: string
  order: number
  isActive: boolean
}

const defaultStats: Omit<Statistic, 'id'>[] = [
  { label: 'App Downloads', value: 10000, prefix: '', suffix: '+', icon: 'Download', order: 1, isActive: true },
  { label: 'Happy Riders', value: 5000, prefix: '', suffix: '+', icon: 'Users', order: 2, isActive: true },
  { label: 'Cities', value: 15, prefix: '', suffix: '+', icon: 'MapPin', order: 3, isActive: true },
  { label: 'Money Saved', value: 50, prefix: '₹', suffix: 'L+', icon: 'IndianRupee', order: 4, isActive: true },
]

export default function StatsPage() {
  const [stats, setStats] = useState<Statistic[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data, error } = await contentAPI.stats.list()

      if (error) {
        toast({
          title: 'Failed to load statistics',
          description: error,
          variant: 'destructive',
        })
        setStats([])
      } else if (data) {
        setStats(data.sort((a, b) => a.order - b.order))
      } else {
        setStats([])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast({
        title: 'Failed to load statistics',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (stat: Statistic) => {
    setSaving(true)

    try {
      const { id, ...statData } = stat
      const { error } = await contentAPI.stats.update(id, statData)

      if (error) {
        toast({
          title: 'Failed to update statistic',
          description: error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Statistic updated successfully',
        })
      }
    } catch (error) {
      console.error('Error saving stat:', error)
      toast({
        title: 'Failed to update statistic',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    setSaving(true)

    try {
      const newStat = {
        label: 'New Statistic',
        value: 0,
        prefix: '',
        suffix: '+',
        icon: 'Star',
        order: stats.length + 1,
        isActive: true,
      }

      const { data, error } = await contentAPI.stats.create(newStat)

      if (error) {
        toast({
          title: 'Failed to add statistic',
          description: error,
          variant: 'destructive',
        })
      } else if (data) {
        setStats([...stats, data])
        toast({
          title: 'New statistic added successfully',
        })
      }
    } catch (error) {
      console.error('Error adding stat:', error)
      toast({
        title: 'Failed to add statistic',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return

    try {
      const { error } = await contentAPI.stats.delete(id)

      if (error) {
        toast({
          title: 'Failed to delete statistic',
          description: error,
          variant: 'destructive',
        })
      } else {
        setStats(stats.filter((s) => s.id !== id))
        toast({
          title: 'Statistic deleted successfully',
        })
      }
    } catch (error) {
      console.error('Error deleting stat:', error)
      toast({
        title: 'Failed to delete statistic',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleInitialize = async () => {
    if (!confirm('This will initialize the stats collection with default values. Continue?')) return

    setSaving(true)

    try {
      const newStats: Statistic[] = []
      for (const stat of defaultStats) {
        const { data, error } = await contentAPI.stats.create(stat)
        if (data) {
          newStats.push(data)
        } else if (error) {
          console.error('Error creating stat:', error)
        }
      }

      setStats(newStats)
      toast({
        title: 'Statistics initialized successfully',
        description: `Created ${newStats.length} statistics`,
      })
    } catch (error) {
      console.error('Error initializing stats:', error)
      toast({
        title: 'Failed to initialize statistics',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const updateStat = (id: string, field: keyof Statistic, value: any) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Statistics</h1>
            <p className="text-muted-foreground">Manage homepage statistics (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {stats.length === 0 && (
            <Button variant="outline" onClick={handleInitialize} disabled={saving}>
              Initialize Defaults
            </Button>
          )}
          <Button onClick={handleAdd} disabled={saving} variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            Add Statistic
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex items-center text-muted-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 grid md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                          placeholder="App Downloads"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={stat.value}
                          onChange={(e) => updateStat(stat.id, 'value', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prefix</Label>
                        <Input
                          value={stat.prefix}
                          onChange={(e) => updateStat(stat.id, 'prefix', e.target.value)}
                          placeholder="₹"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Suffix</Label>
                        <Input
                          value={stat.suffix}
                          onChange={(e) => updateStat(stat.id, 'suffix', e.target.value)}
                          placeholder="+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Input
                          value={stat.icon || ''}
                          onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                          placeholder="Users"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(stat)}
                        disabled={saving}
                        variant="gradient"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(stat.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {stats.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No statistics yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first statistic or initialize with defaults
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleInitialize} disabled={saving}>
                Initialize Defaults
              </Button>
              <Button onClick={handleAdd} disabled={saving} variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Statistic
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How statistics will appear on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.filter(s => s.isActive).map((stat) => (
                <div key={stat.id} className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-teal">
                    {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
