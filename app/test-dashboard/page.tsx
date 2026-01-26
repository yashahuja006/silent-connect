'use client'

import { motion } from 'framer-motion'
import { NavigationBar } from '@/components/shared/navigation-bar'

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 neural-bg">
      <div className="container mx-auto px-6 py-6">
        <NavigationBar />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
        <h1 className="text-6xl font-bold text-electric text-glow mb-6">
          🎉 Success!
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          You've successfully accessed the Silent-Connect dashboard!
        </p>
        
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-electric mb-4">Demo Dashboard</h2>
          <p className="text-gray-400 mb-6">
            This is a simplified test version to verify the interface is working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold text-electric mb-2">Gesture Recognition</h3>
              <p className="text-gray-300 text-sm">Ready to track hand gestures</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold text-electric mb-2">Voice Control</h3>
              <p className="text-gray-300 text-sm">Speech synthesis available</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold text-electric mb-2">System Status</h3>
              <p className="text-green-400 text-sm">All systems operational</p>
            </div>
          </div>
        </div>
        
        <div className="space-x-4">
          <a 
            href="/dashboard" 
            className="glass-button px-6 py-3 text-white hover:text-electric transition-colors inline-block"
          >
            Full Dashboard
          </a>
          <a 
            href="/dashboard/demo" 
            className="glass-button px-6 py-3 text-white hover:text-electric transition-colors inline-block"
          >
            MediaPipe Demo
          </a>
          <a 
            href="/auth/sign-in" 
            className="glass-button px-6 py-3 text-gray-300 hover:text-white transition-colors inline-block"
          >
            Authentication
          </a>
          <a 
            href="/" 
            className="glass-button px-6 py-3 text-gray-300 hover:text-white transition-colors inline-block"
          >
            Back to Home
          </a>
        </div>
        </motion.div>
      </div>
    </div>
  )
}