'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/glass-panel'
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-electric text-glow mb-2">
          Usage Analytics
        </h1>
        <p className="text-gray-400 text-lg">
          Detailed insights into your Silent-Connect usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center">
          <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">1,247</div>
          <div className="text-gray-400 text-sm">Total Gestures</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">87.3%</div>
          <div className="text-gray-400 text-sm">Accuracy Rate</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">42.5h</div>
          <div className="text-gray-400 text-sm">Practice Time</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Users className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">7</div>
          <div className="text-gray-400 text-sm">Day Streak</div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-electric mb-4">Weekly Performance</h3>
        <div className="h-64 flex items-end space-x-2">
          {[65, 78, 82, 91, 87, 94, 89].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-electric-500 to-electric-400 rounded-sm"
                style={{ height: `${value}%` }}
              />
              <div className="text-xs text-gray-400 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Most Used Gestures</h3>
          <div className="space-y-3">
            {[
              { name: 'Hello', count: 156, percentage: 85 },
              { name: 'Thank You', count: 134, percentage: 72 },
              { name: 'Yes', count: 98, percentage: 53 },
              { name: 'No', count: 87, percentage: 47 }
            ].map((gesture, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{gesture.name}</div>
                  <div className="text-gray-400 text-sm">{gesture.count} times</div>
                </div>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-electric-400 h-2 rounded-full"
                    style={{ width: `${gesture.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 glass-panel rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-white text-sm">Completed practice session</div>
                <div className="text-gray-400 text-xs">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 glass-panel rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <div className="text-white text-sm">New gesture learned</div>
                <div className="text-gray-400 text-xs">1 day ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 glass-panel rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div>
                <div className="text-white text-sm">Achievement unlocked</div>
                <div className="text-gray-400 text-xs">3 days ago</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}