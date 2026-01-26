'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/glass-panel'
import { Activity, Heart, TrendingUp, Clock } from 'lucide-react'

export default function HealthPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-electric text-glow mb-2">
          Health Analytics
        </h1>
        <p className="text-gray-400 text-lg">
          Track your rehabilitation progress and hand mobility
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center">
          <Activity className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">89%</div>
          <div className="text-gray-400 text-sm">Hand Mobility</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">156</div>
          <div className="text-gray-400 text-sm">Exercises Done</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">+12%</div>
          <div className="text-gray-400 text-sm">Improvement</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">45m</div>
          <div className="text-gray-400 text-sm">Daily Practice</div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-electric mb-4">Rehabilitation Exercises</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div>
              <h4 className="text-white font-medium">Finger Flexibility</h4>
              <p className="text-gray-400 text-sm">Open and close hand exercises</p>
            </div>
            <button className="glass-button px-4 py-2 text-white hover:text-electric">
              Start
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div>
              <h4 className="text-white font-medium">Wrist Rotation</h4>
              <p className="text-gray-400 text-sm">Circular wrist movements</p>
            </div>
            <button className="glass-button px-4 py-2 text-white hover:text-electric">
              Start
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div>
              <h4 className="text-white font-medium">Grip Strength</h4>
              <p className="text-gray-400 text-sm">Squeeze and release motions</p>
            </div>
            <button className="glass-button px-4 py-2 text-white hover:text-electric">
              Start
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}