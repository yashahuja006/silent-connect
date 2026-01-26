'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/glass-panel'
import { Home, Lightbulb, Thermometer, Lock, Wifi, Power } from 'lucide-react'

export default function SmartHomePage() {
  const devices = [
    {
      name: 'Living Room Lights',
      type: 'Lighting',
      status: 'On',
      icon: Lightbulb,
      gesture: 'Point Up',
      color: 'text-yellow-400'
    },
    {
      name: 'Thermostat',
      type: 'Climate',
      status: '72°F',
      icon: Thermometer,
      gesture: 'Thumbs Up/Down',
      color: 'text-blue-400'
    },
    {
      name: 'Front Door',
      type: 'Security',
      status: 'Locked',
      icon: Lock,
      gesture: 'Closed Fist',
      color: 'text-green-400'
    },
    {
      name: 'WiFi Router',
      type: 'Network',
      status: 'Connected',
      icon: Wifi,
      gesture: 'Wave',
      color: 'text-purple-400'
    }
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
          Smart Home Control
        </h1>
        <p className="text-gray-400 text-lg">
          Control your IoT devices with hand gestures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device, index) => {
          const Icon = device.icon
          return (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-gray-500/20 border border-gray-500/30">
                    <Icon className={`w-6 h-6 ${device.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{device.name}</h3>
                    <span className="text-xs text-gray-400">{device.type}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white font-medium">{device.status}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Gesture:</span>
                    <span className="text-electric text-sm">{device.gesture}</span>
                  </div>
                  
                  <button className="glass-button w-full py-2 text-white hover:text-electric transition-colors">
                    Control Device
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="glass-button w-full py-3 text-left px-4 text-white hover:text-electric transition-colors">
              <div className="flex items-center justify-between">
                <span>Turn Off All Lights</span>
                <Power className="w-5 h-5" />
              </div>
            </button>
            <button className="glass-button w-full py-3 text-left px-4 text-white hover:text-electric transition-colors">
              <div className="flex items-center justify-between">
                <span>Lock All Doors</span>
                <Lock className="w-5 h-5" />
              </div>
            </button>
            <button className="glass-button w-full py-3 text-left px-4 text-white hover:text-electric transition-colors">
              <div className="flex items-center justify-between">
                <span>Set Night Mode</span>
                <Home className="w-5 h-5" />
              </div>
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-electric mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Connected Devices:</span>
              <span className="text-green-400 font-medium">12/15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Network Status:</span>
              <span className="text-green-400 font-medium">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Update:</span>
              <span className="text-white font-medium">2 min ago</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}