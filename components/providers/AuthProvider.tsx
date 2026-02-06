'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, resetPassword } from '@/lib/auth/user-auth'
import { getUserProfile, createUserProfile, UserProfile } from '@/lib/auth/user-profile'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInGoogle: () => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    try {
      unsubscribe = onAuthChange(async (firebaseUser) => {
        try {
          setUser(firebaseUser)
          if (firebaseUser) {
            let userProfile = await getUserProfile(firebaseUser.uid)
            if (!userProfile) {
              await createUserProfile(firebaseUser.uid, {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              })
              userProfile = await getUserProfile(firebaseUser.uid)
            }
            setProfile(userProfile)
          } else {
            setProfile(null)
          }
        } catch (err) {
          console.error('AuthProvider: auth state change error', err)
          setProfile(null)
        } finally {
          setLoading(false)
        }
      })
    } catch (err) {
      console.error('AuthProvider: Firebase auth init failed', err)
      setLoading(false)
    }
    return () => unsubscribe?.()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      console.error('Sign in failed:', err)
      throw err
    }
  }

  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    try {
      const cred = await signUpWithEmail(email, password)
      await createUserProfile(cred.user.uid, {
        email: cred.user.email,
        displayName: displayName || cred.user.displayName,
        photoURL: cred.user.photoURL,
      })
    } catch (err) {
      console.error('Sign up failed:', err)
      throw err
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const cred = await signInWithGoogle()
      const existing = await getUserProfile(cred.user.uid)
      if (!existing) {
        await createUserProfile(cred.user.uid, {
          email: cred.user.email,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
        })
      }
    } catch (err) {
      console.error('Google sign in failed:', err)
      throw err
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setProfile(null)
    } catch (err) {
      console.error('Logout failed:', err)
      throw err
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      await resetPassword(email)
    } catch (err) {
      console.error('Password reset failed:', err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signInGoogle: handleGoogleSignIn,
      logout: handleLogout,
      forgotPassword: handleForgotPassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
