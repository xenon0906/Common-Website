'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  HelpCircle,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
} from 'lucide-react'
import {
  getFirebaseDb,
  getAppId,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from '@/lib/firebase'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  visible: boolean
  order: number
}

const categories = [
  { id: 'general', label: 'General', color: 'bg-blue-500' },
  { id: 'safety', label: 'Safety', color: 'bg-green-500' },
  { id: 'payments', label: 'Payments', color: 'bg-purple-500' },
  { id: 'account', label: 'Account', color: 'bg-orange-500' },
  { id: 'rides', label: 'Rides', color: 'bg-teal-500' },
]

const defaultFAQs: Omit<FAQ, 'id'>[] = [
  {
    question: 'What is Snapgo?',
    answer: 'Snapgo is a ride-sharing platform that connects verified co-riders heading the same way, allowing them to split fares and save money while traveling safely.',
    category: 'general',
    visible: true,
    order: 1,
  },
  {
    question: 'How do I book a ride?',
    answer: 'Download the Snapgo app, create an account, enter your destination, and browse available rides. You can also post your own ride to find co-riders.',
    category: 'rides',
    visible: true,
    order: 2,
  },
  {
    question: 'Is Snapgo safe?',
    answer: 'Yes! All users are verified with college ID, Aadhaar, and phone number. We also have real-time ride tracking, emergency SOS, and 24/7 support.',
    category: 'safety',
    visible: true,
    order: 3,
  },
  {
    question: 'How do payments work?',
    answer: 'Payments are handled securely through the app. Fares are automatically split among co-riders, and you can pay using UPI, cards, or wallet balance.',
    category: 'payments',
    visible: true,
    order: 4,
  },
]

export default function FAQManagerPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'faq')
      const snapshot = await getDocs(collRef)

      if (snapshot.empty) {
        setFaqs([])
      } else {
        const items = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as FAQ[]
        setFaqs(items.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setMessage({ type: 'error', text: 'Failed to load FAQs from Firestore' })
      setFaqs([])
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

      // Update all FAQs
      for (const faq of faqs) {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'faq', faq.id)
        const { id, ...faqData } = faq
        await setDoc(docRef, faqData)
      }

      setMessage({ type: 'success', text: 'FAQs saved successfully!' })
    } catch (error) {
      console.error('Error saving FAQs:', error)
      setMessage({ type: 'error', text: 'Failed to save FAQs' })
    } finally {
      setSaving(false)
    }
  }

  const addFAQ = async () => {
    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'faq')

      const newFaq = {
        question: 'New Question',
        answer: '',
        category: 'general',
        visible: true,
        order: faqs.length,
      }

      const docRef = await addDoc(collRef, newFaq)
      const newFaqWithId = { id: docRef.id, ...newFaq }
      setFaqs([...faqs, newFaqWithId])
      setExpandedId(docRef.id)
      setMessage({ type: 'success', text: 'New FAQ added!' })
    } catch (error) {
      console.error('Error adding FAQ:', error)
      setMessage({ type: 'error', text: 'Failed to add FAQ' })
    }
  }

  const updateFAQ = (id: string, updates: Partial<FAQ>) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, ...updates } : faq)))
  }

  const removeFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'faq', id)
      await deleteDoc(docRef)
      setFaqs(faqs.filter((faq) => faq.id !== id))
      setMessage({ type: 'success', text: 'FAQ deleted!' })
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      setMessage({ type: 'error', text: 'Failed to delete FAQ' })
    }
  }

  const handleInitialize = async () => {
    if (!confirm('This will initialize the FAQ collection with default values. Continue?')) return

    setSaving(true)
    setMessage(null)

    try {
      const db = getFirebaseDb()
      const appId = getAppId()
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'faq')

      const newFaqs: FAQ[] = []
      for (const faq of defaultFAQs) {
        const docRef = await addDoc(collRef, faq)
        newFaqs.push({ id: docRef.id, ...faq })
      }

      setFaqs(newFaqs)
      setMessage({ type: 'success', text: 'FAQs initialized with defaults!' })
    } catch (error) {
      console.error('Error initializing FAQs:', error)
      setMessage({ type: 'error', text: 'Failed to initialize FAQs' })
    } finally {
      setSaving(false)
    }
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || 'bg-gray-500'
  }

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.label || categoryId
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
            <HelpCircle className="w-8 h-8 text-primary" />
            FAQ Manager
          </h1>
          <p className="text-muted-foreground">Manage frequently asked questions (Firestore)</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchFAQs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {faqs.length === 0 && (
            <Button variant="outline" onClick={handleInitialize} disabled={saving}>
              Initialize Defaults
            </Button>
          )}
          <Button variant="outline" onClick={addFAQ}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{faqs.length}</p>
            <p className="text-sm text-muted-foreground">Total FAQs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{faqs.filter((f) => f.visible).length}</p>
            <p className="text-sm text-muted-foreground">Visible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-500">{faqs.filter((f) => !f.visible).length}</p>
            <p className="text-sm text-muted-foreground">Hidden</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-teal">
              {faqs.length > 0 ? Math.round(faqs.reduce((acc, f) => acc + f.answer.length, 0) / faqs.length) : 0}
            </p>
            <p className="text-sm text-muted-foreground">Avg. Length</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={!faq.visible ? 'opacity-60' : ''}>
              <CardContent className="p-0">
                {/* Collapsed Header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`text-white border-0 ${getCategoryColor(faq.category)}`}
                      >
                        {getCategoryLabel(faq.category)}
                      </Badge>
                      {!faq.visible && (
                        <Badge variant="secondary">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold truncate">{faq.question}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateFAQ(faq.id, { visible: !faq.visible })
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        faq.visible ? 'text-green-600 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {faq.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFAQ(faq.id)
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="p-4 space-y-4">
                      <div>
                        <Label htmlFor={`question-${faq.id}`}>Question</Label>
                        <Input
                          id={`question-${faq.id}`}
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                        <Textarea
                          id={`answer-${faq.id}`}
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                          rows={4}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`category-${faq.id}`}>Category</Label>
                          <select
                            id={`category-${faq.id}`}
                            value={faq.category}
                            onChange={(e) => updateFAQ(faq.id, { category: e.target.value })}
                            className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={faq.visible}
                              onCheckedChange={(checked) => updateFAQ(faq.id, { visible: checked })}
                            />
                            <Label>Visible on website</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFAQs.length === 0 && faqs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No FAQs yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first FAQ or initialize with defaults
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleInitialize} disabled={saving}>
                Initialize Defaults
              </Button>
              <Button onClick={addFAQ} variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFAQs.length === 0 && faqs.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {faqs.filter((f) => f.visible).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How FAQs will appear on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h3>
              {faqs
                .filter((f) => f.visible)
                .slice(0, 3)
                .map((faq) => (
                  <div key={faq.id} className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              {faqs.filter((f) => f.visible).length > 3 && (
                <p className="text-center text-sm text-muted-foreground">
                  + {faqs.filter((f) => f.visible).length - 3} more FAQs
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
