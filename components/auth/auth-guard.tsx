'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Check for demo mode from URL or localStorage
    const urlDemo = searchParams.get('demo') === 'true'
    const localDemo = typeof window !== 'undefined' && localStorage.getItem('demo-mode') === 'true'
    const isDemoMode = urlDemo || localDemo

    if (isDemoMode) {
      console.log('Demo mode activated')
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo-mode', 'true')
      }
      setDemoMode(true)
      setLoading(false)
      return
    }

    // Regular authentication flow
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('demo-mode')
          router.push('/auth/sign-in')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router, searchParams])

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-slate-900 neural-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-electric-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading Silent-Connect...</p>
          </div>
        </div>
      )
    )
  }

  // Allow access in demo mode or if user is authenticated
  if (demoMode || user) {
    return <>{children}</>
  }

  // Redirect to sign-in if not authenticated
  router.push('/auth/sign-in')
  return null
}