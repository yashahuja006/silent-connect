'use client'

import { GlassCard } from '@/components/shared/glass-panel'

interface ActivityData {
  date: string
  accuracy: number
  gestures: number
  timestamp: number
}

interface RecentActivityChartProps {
  data: ActivityData[]
}

export function RecentActivityChart({ data }: RecentActivityChartProps) {
  // Simple chart representation without external dependencies
  const maxAccuracy = Math.max(...data.map(d => d.accuracy))
  const maxGestures = Math.max(...data.map(d => d.gestures))

  return (
    <div className="h-64 flex items-end space-x-1">
      {data.slice(-14).map((item, index) => {
        const accuracyHeight = (item.accuracy / maxAccuracy) * 100
        const gestureHeight = (item.gestures / maxGestures) * 100
        
        return (
          <div key={item.date} className="flex-1 flex flex-col items-center space-y-1">
            {/* Accuracy bar */}
            <div className="w-full bg-gray-700 rounded-sm overflow-hidden" style={{ height: '80px' }}>
              <div 
                className="bg-gradient-to-t from-electric-500 to-electric-400 rounded-sm transition-all duration-300"
                style={{ height: `${accuracyHeight}%` }}
              />
            </div>
            
            {/* Gesture count bar */}
            <div className="w-full bg-gray-700 rounded-sm overflow-hidden" style={{ height: '60px' }}>
              <div 
                className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm transition-all duration-300"
                style={{ height: `${gestureHeight}%` }}
              />
            </div>
            
            {/* Date label */}
            <div className="text-xs text-gray-400 rotate-45 origin-left">
              {new Date(item.date).getDate()}
            </div>
          </div>
        )
      })}
    </div>
  )
}