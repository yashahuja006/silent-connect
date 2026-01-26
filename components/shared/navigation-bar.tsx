'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Activity, BarChart3, Shield, User, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/test-dashboard', label: 'Test Dashboard', icon: Shield },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard/demo', label: 'Demo', icon: Activity },
  { href: '/auth/sign-in', label: 'Auth', icon: User },
]

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <nav className="glass-panel p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-400 to-purple-400 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-electric">Silent-Connect</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                  'hover:bg-glass-100 hover:text-electric',
                  isActive 
                    ? 'bg-electric-500/20 text-electric border border-electric-500/30' 
                    : 'text-gray-300'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}