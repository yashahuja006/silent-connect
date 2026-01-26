'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { NavigationBar } from '@/components/shared/navigation-bar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 neural-bg">
      <div className="container mx-auto px-6 py-6">
        <NavigationBar />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-electric text-glow mb-6">
            Silent-Connect
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Revolutionary Universal AI Platform featuring advanced voice-controlled hand gesture recognition, 
            IoT control, health analytics, and custom AI training.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="glass-button px-8 py-4 text-lg font-medium text-white hover:text-electric transition-colors"
            >
              Enter Dashboard
            </Link>
            <Link
              href="/dashboard/demo"
              className="glass-button px-8 py-4 text-lg font-medium text-gray-300 hover:text-white transition-colors"
            >
              Try Demo
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-electric mb-3">Gesture Recognition</h3>
              <p className="text-gray-300">Advanced MediaPipe-powered hand tracking with custom gesture training</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-electric mb-3">Voice Control</h3>
              <p className="text-gray-300">Multi-language voice synthesis and recognition for accessibility</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-electric mb-3">IoT Integration</h3>
              <p className="text-gray-300">Smart home control through gestures and voice commands</p>
            </div>
          </div>
        </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}