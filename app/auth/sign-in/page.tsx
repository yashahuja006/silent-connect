'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { signInWithEmail } from '@/lib/supabase/client'
import { NavigationBar } from '@/components/shared/navigation-bar'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmail(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = () => {
    // Set demo mode and navigate directly
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-mode', 'true')
      // Use window.location.replace to avoid redirect loops
      window.location.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 neural-bg">
      <div className="container mx-auto px-6 py-6">
        <NavigationBar />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-electric text-glow mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your Silent-Connect dashboard
          </p>
        </div>

        {/* Sign In Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full py-3 text-white font-medium hover:text-electric transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Demo Access Button */}
            <button
              type="button"
              onClick={() => window.location.href = '/test-dashboard'}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors border border-gray-600 hover:border-gray-500 rounded-lg"
            >
              Continue as Demo User
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-400 hover:text-electric transition-colors"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/auth/sign-up"
                className="text-electric hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-electric transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  )
}