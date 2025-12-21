'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

interface ContactInfo {
  [key: string]: string
}

const contactFields = [
  { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'info@snapgo.co.in' },
  { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+91 6398786105' },
  { key: 'address', label: 'Address', icon: MapPin, placeholder: 'Block 45, Sharda University...', isTextarea: true },
]

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const res = await fetch('/api/content/contact')
      const data = await res.json()
      setContact(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch contact info', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Success', description: 'Contact info updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save contact info', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
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
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Contact Information</h1>
            <p className="text-muted-foreground">Update contact details displayed on the website</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {contactFields.map((field, index) => {
            const Icon = field.icon
            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <Label className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {field.label}
                </Label>
                {field.isTextarea ? (
                  <Textarea
                    value={contact[field.key] || ''}
                    onChange={(e) => setContact({ ...contact, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={contact[field.key] || ''}
                    onChange={(e) => setContact({ ...contact, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                  />
                )}
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
