'use client'

import { useState, useEffect } from 'react'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter } from '@/components/admin/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { MicroLoader } from '@/components/admin/MicroLoader'
import { Save, TrendingUp, Plus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'

interface StatItem {
  id?: string
  label: string
  value: number
  prefix: string
  suffix: string
  icon: string | null
  order: number
  isActive: boolean
}

const DEFAULT_STATS: StatItem[] = [
  { label: 'App Downloads', value: 10000, prefix: '', suffix: '+', icon: null, order: 0, isActive: true },
  { label: 'Peak Daily Rides', value: 150, prefix: '', suffix: '+', icon: null, order: 1, isActive: true },
  { label: 'Cost Savings', value: 75, prefix: '', suffix: '%', icon: null, order: 2, isActive: true },
  { label: 'Trees Equivalent', value: 500, prefix: '', suffix: '+', icon: null, order: 3, isActive: true },
]

export default function NumbersPage() {
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/numbers')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setStats(data)
          }
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateStat = (index: number, field: keyof StatItem, value: string | number | boolean) => {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const addStat = () => {
    setStats(prev => [
      ...prev,
      { label: '', value: 0, prefix: '', suffix: '+', icon: null, order: prev.length, isActive: true },
    ])
  }

  const removeStat = (index: number) => {
    setStats(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })))
  }

  const handleSave = async () => {
    // Validate
    const invalid = stats.some(s => !s.label.trim())
    if (invalid) {
      toast({ title: 'Validation Error', description: 'All stats must have a label.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save')
      }

      toast({
        title: 'Stats updated',
        description: 'Homepage statistics have been saved successfully.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save stats. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <MicroLoader size="lg" text="Loading stats..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homepage Stats</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit the statistics displayed on the homepage counter section
          </p>
        </div>
        <Button
          onClick={addStat}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Stat
        </Button>
      </div>

      {/* Stats Editor */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <GlassCardTitle>Statistics</GlassCardTitle>
          </div>
          <GlassCardDescription>
            These numbers appear in the &quot;Our Impact&quot; section on the homepage with animated counters
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border',
                  stat.isActive
                    ? 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-100/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-800 opacity-60',
                  animations.smooth
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${index}`} className="text-xs text-gray-500">Active</Label>
                      <Switch
                        id={`active-${index}`}
                        checked={stat.isActive}
                        onCheckedChange={(checked) => updateStat(index, 'isActive', checked)}
                      />
                    </div>
                    {stats.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => removeStat(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`label-${index}`} className="text-gray-700 dark:text-gray-300 text-sm">
                      Label
                    </Label>
                    <Input
                      id={`label-${index}`}
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="e.g. App Downloads"
                      className={cn(
                        'bg-white/50 dark:bg-gray-800/50',
                        'border-gray-200 dark:border-gray-700',
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`value-${index}`} className="text-gray-700 dark:text-gray-300 text-sm">
                      Value
                    </Label>
                    <Input
                      id={`value-${index}`}
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', parseInt(e.target.value) || 0)}
                      className={cn(
                        'bg-white/50 dark:bg-gray-800/50',
                        'border-gray-200 dark:border-gray-700',
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`prefix-${index}`} className="text-gray-700 dark:text-gray-300 text-sm">
                      Prefix
                    </Label>
                    <Input
                      id={`prefix-${index}`}
                      value={stat.prefix}
                      onChange={(e) => updateStat(index, 'prefix', e.target.value)}
                      placeholder="e.g. $"
                      className={cn(
                        'bg-white/50 dark:bg-gray-800/50',
                        'border-gray-200 dark:border-gray-700',
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`suffix-${index}`} className="text-gray-700 dark:text-gray-300 text-sm">
                      Suffix
                    </Label>
                    <Input
                      id={`suffix-${index}`}
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                      placeholder="e.g. + or %"
                      className={cn(
                        'bg-white/50 dark:bg-gray-800/50',
                        'border-gray-200 dark:border-gray-700',
                      )}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-xs text-gray-400 mr-2">Preview:</span>
                  <span className="text-lg font-bold text-primary">
                    {stat.prefix}{stat.value.toLocaleString('en-IN')}{stat.suffix}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCardContent>
        <GlassCardFooter>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'bg-teal-600 hover:bg-teal-700 text-white',
              animations.smooth
            )}
          >
            {saving ? (
              <>
                <MicroLoader size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Stats
              </>
            )}
          </Button>
        </GlassCardFooter>
      </GlassCard>
    </div>
  )
}
