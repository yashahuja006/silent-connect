'use client'

import Link from 'next/link'
import { Play, Settings, BookOpen, Camera, Zap, Brain } from 'lucide-react'
import { GlassCard } from '@/components/shared/glass-panel'

export function QuickActions() {
  const actions = [
    {
      title: 'Start Demo',
      description: 'Test hand tracking',
      icon: Play,
      href: '/dashboard/demo',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Settings',
      description: 'Configure app',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
    },
    {
      title: 'Learn Signs',
      description: 'Gesture guide',
      icon: BookOpen,
      href: '/dashboard/guide',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Camera Test',
      description: 'Check camera',
      icon: Camera,
      href: '/dashboard/demo',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'AI Trainer',
      description: 'Custom gestures',
      icon: Brain,
      href: '/dashboard/ai-trainer',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      title: 'Quick Start',
      description: 'Get started',
      icon: Zap,
      href: '/test-dashboard',
      color: 'text-electric-400',
      bgColor: 'bg-electric-500/20',
      borderColor: 'border-electric-500/30'
    }
  ]

  return (
    <GlassCard className="h-full">
      <div className="p-6">
        <h2 className="text-2xl font-heading text-electric mb-6">Quick Actions</h2>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-glass-100 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${action.bgColor} border ${action.borderColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white group-hover:text-electric transition-colors">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {action.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}