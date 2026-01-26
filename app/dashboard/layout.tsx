'use client'

import { motion } from 'framer-motion'
import { NavigationBar } from '@/components/shared/navigation-bar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 neural-bg">
      <div className="container mx-auto px-6 py-6">
        <NavigationBar />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}