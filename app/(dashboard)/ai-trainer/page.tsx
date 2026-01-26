'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/glass-panel'
import { Brain, Plus, Play, Save, Trash2 } from 'lucide-react'

export default function AITrainerPage() {
  const customGestures = [
    { name: 'Custom Wave', accuracy: '94%', trained: '2 days ago' },
    { name: 'Point Left', accuracy: '87%', trained: '1 week ago' },
    { name: 'Circle Motion', accuracy: '91%', trained: '3 days ago' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-electric text-glow mb-2">
          AI Gesture Trainer
        </h1>
        <p className="text-gray-400 text-lg">
          Create and train custom gesture recognition models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Training Studio</h3>
            
            <div className="bg-black rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Camera feed for gesture training</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="glass-button px-6 py-3 flex items-center space-x-2 text-green-400">
                <Play className="w-5 h-5" />
                <span>Start Training</span>
              </button>
              <button className="glass-button px-6 py-3 flex items-center space-x-2 text-blue-400">
                <Save className="w-5 h-5" />
                <span>Save Model</span>
              </button>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Custom Gestures</h3>
              <button className="glass-button p-2 text-electric">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {customGestures.map((gesture, index) => (
                <div key={index} className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{gesture.name}</h4>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">{gesture.accuracy}</span>
                    <span className="text-gray-400">{gesture.trained}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
          <div className="text-gray-400">Custom Models</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">91%</div>
          <div className="text-gray-400">Avg Accuracy</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">247</div>
          <div className="text-gray-400">Training Samples</div>
        </GlassCard>
      </div>
    </motion.div>
  )
}