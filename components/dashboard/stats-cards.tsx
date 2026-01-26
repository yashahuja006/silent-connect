'use client'

import { motion } from 'framer-motion'
import { Activity, Target, Clock, Trophy } from 'lucide-react'
import { GlassCard } from '@/components/shared/glass-panel'

interface StatsCardsProps {
  stats: {
    totalGestures: number
    avgAccuracy: number
    practiceHours: number
    currentStreak: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Gestures',
      value: stats.totalGestures.toLocaleString(),
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Avg Accuracy',
      value: `${stats.avgAccuracy}%`,
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Practice Hours',
      value: `${stats.practiceHours}h`,
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${card.bgColor} border ${card.borderColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}