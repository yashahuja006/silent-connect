'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/glass-panel'

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
}

const SkeletonBox = ({ className = '', children, style }: { className?: string, children?: React.ReactNode, style?: React.CSSProperties }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`} style={style}>
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
    />
    {children}
  </div>
)

const StatCardSkeleton = () => (
  <GlassCard className="p-6">
    <div className="flex items-center justify-between mb-4">
      <SkeletonBox className="w-12 h-12 rounded-xl" />
      <SkeletonBox className="w-12 h-4" />
    </div>
    <SkeletonBox className="w-20 h-8 mb-2" />
    <SkeletonBox className="w-24 h-4 mb-4" />
    <SkeletonBox className="w-full h-1 rounded-full" />
  </GlassCard>
)

const ChartSkeleton = () => (
  <GlassCard className="h-full">
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="w-32 h-6" />
        <div className="flex space-x-2">
          <SkeletonBox className="w-12 h-6 rounded" />
          <SkeletonBox className="w-12 h-6 rounded" />
        </div>
      </div>
      
      {/* Chart area */}
      <div className="h-80 relative">
        <SkeletonBox className="w-full h-full rounded-lg">
          {/* Simulate chart lines */}
          <div className="absolute inset-4 flex items-end justify-between">
            {Array.from({ length: 12 }).map((_, i) => {
              const height = Math.random() * 60 + 20
              return (
                <SkeletonBox
                  key={i}
                  className="w-2 bg-white/10"
                  style={{ height: `${height}%` }}
                />
              )
            })}
          </div>
        </SkeletonBox>
      </div>
      
      {/* Footer stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <SkeletonBox className="w-16 h-8 mx-auto mb-2" />
            <SkeletonBox className="w-20 h-4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </GlassCard>
)

const QuickActionsSkeleton = () => (
  <GlassCard className="h-full">
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <SkeletonBox className="w-9 h-9 rounded-lg" />
        <SkeletonBox className="w-28 h-5" />
      </div>
      
      {/* Action buttons */}
      <div className="space-y-3">
        {/* Primary button */}
        <div className="p-4 rounded-xl border border-white/10">
          <div className="flex items-center space-x-4">
            <SkeletonBox className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <SkeletonBox className="w-28 h-5 mb-2" />
              <SkeletonBox className="w-36 h-4" />
            </div>
          </div>
        </div>
        
        {/* Regular buttons */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-4">
              <SkeletonBox className="w-9 h-9 rounded-lg" />
              <div className="flex-1">
                <SkeletonBox className="w-24 h-4 mb-2" />
                <SkeletonBox className="w-32 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress section */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <SkeletonBox className="w-28 h-4 mb-3" />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <SkeletonBox className="w-16 h-4" />
            <SkeletonBox className="w-8 h-4" />
          </div>
          <SkeletonBox className="w-full h-2 rounded-full" />
        </div>
      </div>
    </div>
  </GlassCard>
)

const InsightCardSkeleton = () => (
  <GlassCard className="p-6">
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonBox className="w-9 h-9 rounded-lg" />
      <SkeletonBox className="w-24 h-5" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <SkeletonBox className="w-20 h-4" />
          <SkeletonBox className="w-12 h-4" />
        </div>
      ))}
    </div>
  </GlassCard>
)

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <SkeletonBox className="w-64 h-10 mb-2" />
        <SkeletonBox className="w-96 h-6" />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCardSkeleton />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[600px]">
        {/* Chart - Takes 3 columns */}
        <motion.div 
          className="xl:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartSkeleton />
        </motion.div>

        {/* Quick Actions - Takes 1 column */}
        <motion.div 
          className="xl:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <QuickActionsSkeleton />
        </motion.div>
      </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            <InsightCardSkeleton />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      <motion.div
        className="fixed bottom-8 right-8 glass-panel p-4 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-electric rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">Loading Dashboard...</span>
        </div>
      </motion.div>
    </div>
  )
}