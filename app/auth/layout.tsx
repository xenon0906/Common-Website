import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Sign in or create your Snapgo account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-teal-50 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
