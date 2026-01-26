import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-electric text-glow mb-4">Command Center</h1>
        <p className="text-gray-400 mb-8">Welcome back! Here's your gesture training overview.</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-electric mb-2">1,247</div>
            <div className="text-gray-400">Total Gestures</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-electric mb-2">87.3%</div>
            <div className="text-gray-400">Avg Accuracy</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-electric mb-2">42.5h</div>
            <div className="text-gray-400">Practice Hours</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-electric mb-2">7</div>
            <div className="text-gray-400">Current Streak</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-electric mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/demo" className="glass-button p-4 text-center hover:text-electric transition-colors">
              <div className="text-lg font-semibold">Start Demo</div>
              <div className="text-sm text-gray-400">MediaPipe hand tracking</div>
            </Link>
            <Link href="/dashboard/translator" className="glass-button p-4 text-center hover:text-electric transition-colors">
              <div className="text-lg font-semibold">Translator</div>
              <div className="text-sm text-gray-400">Gesture recognition</div>
            </Link>
            <Link href="/dashboard/education" className="glass-button p-4 text-center hover:text-electric transition-colors">
              <div className="text-lg font-semibold">Education</div>
              <div className="text-sm text-gray-400">Learn gestures</div>
            </Link>
            <Link href="/dashboard/settings" className="glass-button p-4 text-center hover:text-electric transition-colors">
              <div className="text-lg font-semibold">Settings</div>
              <div className="text-sm text-gray-400">Configure system</div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}