'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { USE_FIREBASE } from '@/lib/config'
import {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth'
import { getFirebaseAuth, getInitialAuthToken } from '@/lib/firebase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [firebaseLoading, setFirebaseLoading] = useState(USE_FIREBASE)
  const [firebaseStatus, setFirebaseStatus] = useState<'checking' | 'success' | 'error' | 'idle'>('idle')

  // Firebase auto-login on mount
  useEffect(() => {
    if (!USE_FIREBASE) {
      setFirebaseLoading(false)
      return
    }

    setFirebaseStatus('checking')
    const auth = getFirebaseAuth()

    // Check if already authenticated
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Already logged in, redirect to admin
        setFirebaseStatus('success')
        setFirebaseLoading(false)
        // Use router.replace for more reliable navigation
        router.replace('/admin')
        return
      }

      // Not logged in, try auto-login
      const token = getInitialAuthToken()
      try {
        if (token) {
          // Try custom token auth
          await signInWithCustomToken(auth, token)
          setFirebaseStatus('success')
        } else {
          // Fall back to anonymous auth
          await signInAnonymously(auth)
          setFirebaseStatus('success')
        }
        // Use router.replace for more reliable navigation
        router.replace('/admin')
      } catch (err: any) {
        console.error('Firebase auto-login error:', err)
        setFirebaseStatus('error')
        setError('Firebase authentication failed. You can still use the traditional login.')
      } finally {
        setFirebaseLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  // Traditional API login (fallback)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // Show Firebase loading state
  if (firebaseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-primary/20 to-dark flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal/10 blur-[120px]"
            animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]"
            animate={{ scale: [1.2, 1, 1.2], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Image
              src="/images/logo/Snapgo%20Logo%20White.png"
              alt={SITE_CONFIG.name}
              fill
              className="object-contain brightness-110"
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-6 h-6 animate-spin text-teal" />
            <span className="text-white/80">
              {firebaseStatus === 'checking' && 'Checking authentication...'}
              {firebaseStatus === 'success' && 'Authentication successful!'}
            </span>
          </div>
          {firebaseStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-teal"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Redirecting to dashboard...</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-primary/20 to-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal/10 blur-[120px]"
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-2 border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-4"
            >
              <div className="relative w-20 h-20 mx-auto">
                <Image
                  src="/images/logo/Snapgo%20Logo%20White.png"
                  alt={SITE_CONFIG.name}
                  fill
                  className="object-contain brightness-110"
                />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              {USE_FIREBASE && firebaseStatus === 'error'
                ? 'Firebase login failed. Use credentials below.'
                : 'Enter your credentials to access the admin panel'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Firebase status indicator */}
            {USE_FIREBASE && (
              <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                firebaseStatus === 'error'
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                  : 'bg-teal/10 border border-teal/20 text-teal'
              }`}>
                {firebaseStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Firebase unavailable - using traditional login</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Firebase connected</span>
                  </>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && !error.includes('Firebase') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="gradient"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Protected area. Unauthorized access is prohibited.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
