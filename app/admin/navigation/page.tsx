'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Menu,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Home,
  Info,
  Briefcase,
  Users,
  FileText,
  Phone,
  Shield,
  HelpCircle,
  Link as LinkIcon,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  href: string
  icon: string
  visible: boolean
  external: boolean
  order: number
  location: string
  section?: string
}

const iconOptions = [
  'Home', 'Info', 'Briefcase', 'Users', 'FileText', 'Phone', 'Shield', 'HelpCircle', 'Star', 'Heart', 'Mail', 'Map'
]

export default function NavigationPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [footerItems, setFooterItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header')
  const [expandedSection, setExpandedSection] = useState<string | null>('company')

  // Fetch navigation items from API
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch('/api/navigation')
        if (response.ok) {
          const data = await response.json()
          const itemsArray = Array.isArray(data) ? data : []
          // Separate header and footer items
          const headerItems = itemsArray.filter((item: MenuItem) => item.location === 'header')
          const footerItemsList = itemsArray.filter((item: MenuItem) => item.location === 'footer')
          setMenuItems(headerItems)
          setFooterItems(footerItemsList)
        } else {
          setMenuItems([])
          setFooterItems([])
        }
      } catch (error) {
        console.error('Failed to fetch navigation:', error)
        setMessage({ type: 'error', text: 'Failed to load navigation' })
        setMenuItems([])
        setFooterItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchNavigation()
  }, [])

  // Group footer items by section
  const footerSections = footerItems.reduce((acc, item) => {
    const section = item.section || 'other'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const sectionTitles: Record<string, string> = {
    company: 'Company',
    product: 'Product',
    legal: 'Legal',
    other: 'Other',
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Save header items
      for (const item of menuItems) {
        if (item.id.startsWith('temp-')) {
          await fetch('/api/navigation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: item.label,
              href: item.href,
              icon: item.icon,
              visible: item.visible,
              external: item.external,
              order: item.order,
              location: 'header',
            }),
          })
        } else {
          await fetch(`/api/navigation/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: item.label,
              href: item.href,
              icon: item.icon,
              visible: item.visible,
              external: item.external,
              order: item.order,
              location: 'header',
            }),
          })
        }
      }

      // Save footer items
      for (const item of footerItems) {
        if (item.id.startsWith('temp-')) {
          await fetch('/api/navigation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: item.label,
              href: item.href,
              icon: item.icon,
              visible: item.visible,
              external: item.external,
              order: item.order,
              location: 'footer',
              section: item.section,
            }),
          })
        } else {
          await fetch(`/api/navigation/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: item.label,
              href: item.href,
              icon: item.icon,
              visible: item.visible,
              external: item.external,
              order: item.order,
              location: 'footer',
              section: item.section,
            }),
          })
        }
      }

      // Refresh the list
      const response = await fetch('/api/navigation')
      if (response.ok) {
        const data = await response.json()
        const headerItems = data.filter((item: MenuItem) => item.location === 'header')
        const footerItemsList = data.filter((item: MenuItem) => item.location === 'footer')
        setMenuItems(headerItems)
        setFooterItems(footerItemsList)
      }

      setMessage({ type: 'success', text: 'Navigation saved successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save navigation' })
    } finally {
      setSaving(false)
    }
  }

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `temp-${Date.now()}`,
      label: 'New Link',
      href: '/',
      icon: 'LinkIcon',
      visible: true,
      external: false,
      order: menuItems.length + 1,
      location: 'header',
    }
    setMenuItems([...menuItems, newItem])
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const removeMenuItem = async (id: string) => {
    if (!id.startsWith('temp-')) {
      try {
        await fetch(`/api/navigation/${id}`, { method: 'DELETE' })
      } catch (error) {
        console.error('Failed to delete menu item:', error)
      }
    }
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const addFooterLink = (sectionId: string) => {
    const newLink: MenuItem = {
      id: `temp-${Date.now()}`,
      label: 'New Link',
      href: '/',
      icon: '',
      visible: true,
      external: false,
      order: footerItems.filter(i => i.section === sectionId).length + 1,
      location: 'footer',
      section: sectionId,
    }
    setFooterItems([...footerItems, newLink])
  }

  const updateFooterLink = (linkId: string, updates: Partial<MenuItem>) => {
    setFooterItems(footerItems.map((link) => (link.id === linkId ? { ...link, ...updates } : link)))
  }

  const removeFooterLink = async (linkId: string) => {
    if (!linkId.startsWith('temp-')) {
      try {
        await fetch(`/api/navigation/${linkId}`, { method: 'DELETE' })
      } catch (error) {
        console.error('Failed to delete footer link:', error)
      }
    }
    setFooterItems(footerItems.filter((link) => link.id !== linkId))
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Menu className="w-8 h-8 text-primary" />
            Navigation Editor
          </h1>
          <p className="text-muted-foreground">Customize header and footer navigation menus</p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="gradient" size="lg">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-600'
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('header')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'header'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Header Menu
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'footer'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Footer Links
        </button>
      </div>

      {/* Header Menu Editor */}
      {activeTab === 'header' && (
        <Card>
          <CardHeader>
            <CardTitle>Header Navigation</CardTitle>
            <CardDescription>Drag to reorder, toggle visibility, or add new links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Reorder.Group
              axis="y"
              values={menuItems}
              onReorder={setMenuItems}
              className="space-y-3"
            >
              {menuItems.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    layout
                    className={`flex items-center gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-shadow ${
                      !item.visible ? 'opacity-50' : ''
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">URL</Label>
                        <Input
                          value={item.href}
                          onChange={(e) => updateMenuItem(item.id, { href: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Icon</Label>
                        <select
                          value={item.icon}
                          onChange={(e) => updateMenuItem(item.id, { icon: e.target.value })}
                          className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.visible}
                            onCheckedChange={(checked) => updateMenuItem(item.id, { visible: checked })}
                          />
                          <span className="text-xs">{item.visible ? 'Visible' : 'Hidden'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.external}
                            onCheckedChange={(checked) => updateMenuItem(item.id, { external: checked })}
                          />
                          <span className="text-xs">External</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeMenuItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <Button variant="outline" onClick={addMenuItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Footer Links Editor */}
      {activeTab === 'footer' && (
        <div className="space-y-4">
          {['company', 'product', 'legal'].map((sectionId) => (
            <Card key={sectionId}>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedSection(expandedSection === sectionId ? null : sectionId)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sectionTitles[sectionId]}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {(footerSections[sectionId] || []).filter((l) => l.visible).length} active
                    </Badge>
                    {expandedSection === sectionId ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedSection === sectionId && (
                <CardContent className="space-y-3">
                  {(footerSections[sectionId] || []).map((link) => (
                    <motion.div
                      key={link.id}
                      layout
                      className={`flex items-center gap-4 p-3 rounded-lg border ${
                        !link.visible ? 'opacity-50 bg-muted/30' : 'bg-background'
                      }`}
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Label</Label>
                          <Input
                            value={link.label}
                            onChange={(e) => updateFooterLink(link.id, { label: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">URL</Label>
                          <Input
                            value={link.href}
                            onChange={(e) => updateFooterLink(link.id, { href: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateFooterLink(link.id, { visible: !link.visible })}
                          className={`p-2 rounded-lg transition-colors ${
                            link.visible ? 'text-green-600 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => removeFooterLink(link.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addFooterLink(sectionId)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How your navigation will appear on the website</CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === 'header' ? (
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="w-24 h-8 bg-white/20 rounded" />
                <div className="flex items-center gap-4">
                  {menuItems
                    .filter((item) => item.visible)
                    .map((item) => (
                      <a
                        key={item.id}
                        href="#"
                        className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1"
                      >
                        {item.label}
                        {item.external && <ExternalLink className="w-3 h-3" />}
                      </a>
                    ))}
                </div>
                <div className="w-24 h-8 bg-primary rounded" />
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-8">
                {['company', 'product', 'legal'].map((sectionId) => (
                  <div key={sectionId}>
                    <h4 className="text-white font-semibold mb-3">{sectionTitles[sectionId]}</h4>
                    <ul className="space-y-2">
                      {(footerSections[sectionId] || [])
                        .filter((link) => link.visible)
                        .map((link) => (
                          <li key={link.id}>
                            <a href="#" className="text-white/60 hover:text-white text-sm">
                              {link.label}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
