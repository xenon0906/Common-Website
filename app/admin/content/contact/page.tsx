'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Loader2, Mail, Phone, MapPin, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import {
  getFirebaseDb,
  getAppId,
  doc,
  getDoc,
  setDoc,
} from '@/lib/firebase'

interface ContactInfo {
  email: string
  phone: string
  address: string
  supportEmail: string
  businessEmail: string
}

const defaultContact: ContactInfo = {
  email: 'info@snapgo.co.in',
  phone: '+91 6398786105',
  address: 'Block 45, Sharda University, Greater Noida, Uttar Pradesh 201310',
  supportEmail: 'support@snapgo.co.in',
  businessEmail: 'business@snapgo.co.in',
}

const contactFields = [
  { key: 'email', label: 'Primary Email', icon: Mail, placeholder: 'info@snapgo.co.in' },
  { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+91 6398786105' },
  { key: 'supportEmail', label: 'Support Email', icon: Mail, placeholder: 'support@snapgo.co.in' },
  { key: 'businessEmail', label: 'Business Email', icon: Mail, placeholder: 'business@snapgo.co.in' },
]

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo>(defaultContact)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'contact')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<ContactInfo>
        setContact({ ...defaultContact, ...data })
      } else {
        setContact(defaultContact)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      setMessage({ type: 'error', text: 'Failed to load contact info from Firestore' })
      setContact(defaultContact)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'content', 'contact')
      await setDoc(docRef, contact)
      setMessage({ type: 'success', text: 'Contact info saved to Firestore!' })
    } catch (error) {
      console.error('Error saving contact info:', error)
      setMessage({ type: 'error', text: 'Failed to save contact info' })
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
            <p className="text-muted-foreground">Update contact details displayed on the website (Firestore)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContact}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="gradient">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Information displayed on the contact page and footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <Input
                  value={(contact as any)[field.key] || ''}
                  onChange={(e) => setContact({ ...contact, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              </motion.div>
            )
          })}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Textarea
              value={contact.address || ''}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              placeholder="Block 45, Sharda University..."
              rows={3}
            />
          </motion.div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How contact information will appear on the website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{contact.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
