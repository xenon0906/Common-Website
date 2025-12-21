'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'

interface Statistic {
  id: string
  label: string
  value: number
  prefix: string
  suffix: string
  icon: string | null
  order: number
  isActive: boolean
}

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
      const res = await fetch('/api/content/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (stat: Statistic) => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast({
        title: 'Success',
        description: 'Statistic updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save statistic',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: 'New Statistic',
          value: 0,
          prefix: '',
          suffix: '+',
          icon: 'Star',
          order: stats.length + 1,
          isActive: true,
        }),
      })

      if (!res.ok) throw new Error('Failed to add')

      const newStat = await res.json()
      setStats([...stats, newStat])
      toast({
        title: 'Success',
        description: 'New statistic added',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add statistic',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return

    try {
      const res = await fetch(`/api/content/stats?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      setStats(stats.filter((s) => s.id !== id))
      toast({
        title: 'Success',
        description: 'Statistic deleted',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete statistic',
        variant: 'destructive',
      })
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
            <p className="text-muted-foreground">Manage homepage statistics</p>
          </div>
        </div>
        <Button onClick={handleAdd} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />
          Add Statistic
        </Button>
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
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
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
                          placeholder="$"
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
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave(stat)}
                        disabled={saving}
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
    </div>
  )
}
