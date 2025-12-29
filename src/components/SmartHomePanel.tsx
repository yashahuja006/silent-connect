import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Lock, Unlock, Fan, Home, Zap, Shield } from 'lucide-react'

interface SmartHomePanelProps {
  currentGesture: string | null
  confidence: number
}

interface DeviceState {
  lights: boolean
  lock: boolean
  fan: boolean
}

const SmartHomePanel: React.FC<SmartHomePanelProps> = ({ currentGesture, confidence }) => {
  const [devices, setDevices] = useState<DeviceState>({
    lights: false,
    lock: false,
    fan: false
  })

  const [lastGesture, setLastGesture] = useState<string | null>(null)

  // Gesture Control Logic
  useEffect(() => {
    if (currentGesture && confidence >= 0.7 && currentGesture !== lastGesture) {
      switch (currentGesture) {
        case 'Point Up':
          setDevices(prev => ({ ...prev, lights: true }))
          console.log('🏠 Smart Home: Lights ON via Point Up gesture')
          break
        case 'No': // Thumbs Down
          setDevices(prev => ({ ...prev, lights: false }))
          console.log('🏠 Smart Home: Lights OFF via Thumbs Down gesture')
          break
        case 'Fist': // Closed Fist
          setDevices(prev => ({ ...prev, lock: true }))
          console.log('🏠 Smart Home: Door LOCKED via Fist gesture')
          break
        case 'Open Palm':
          setDevices(prev => ({ ...prev, fan: !prev.fan }))
          console.log('🏠 Smart Home: Fan TOGGLED via Open Palm gesture')
          break
      }
      setLastGesture(currentGesture)
    }
  }, [currentGesture, confidence, lastGesture])

  // Reset last gesture when no gesture detected
  useEffect(() => {
    if (!currentGesture) {
      setLastGesture(null)
    }
  }, [currentGesture])

  const DeviceCard = ({ 
    title, 
    icon: Icon, 
    isActive, 
    onClick, 
    gesture,
    description 
  }: {
    title: string
    icon: any
    isActive: boolean
    onClick: () => void
    gesture: string
    description: string
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 shadow-lg shadow-yellow-400/20' 
          : 'bg-slate-800/50 border-slate-600/30 hover:border-cyan-500/50'
      } border backdrop-blur-md`}
      onClick={onClick}
    >
      {/* Glow Effect for Active State */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon 
            className={`w-8 h-8 transition-all duration-300 ${
              isActive ? 'text-yellow-400' : 'text-gray-400'
            } ${title === 'Fan' && isActive ? 'animate-spin' : ''}`}
          />
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'
          }`} />
        </div>
        
        <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
          isActive ? 'text-yellow-100' : 'text-gray-200'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm mb-3 transition-colors duration-300 ${
          isActive ? 'text-yellow-200/80' : 'text-gray-400'
        }`}>
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 ${
            isActive 
              ? 'bg-yellow-400/20 text-yellow-200 border border-yellow-400/30' 
              : 'bg-slate-700/50 text-gray-400 border border-slate-600/30'
          }`}>
            {gesture}
          </span>
          <span className={`text-xs font-bold transition-colors duration-300 ${
            isActive ? 'text-green-400' : 'text-gray-500'
          }`}>
            {isActive ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
          <Home className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-400">Smart Home Control</h2>
          <p className="text-sm text-gray-400">Control devices with hand gestures</p>
        </div>
      </div>

      {/* Current Gesture Display */}
      {currentGesture && confidence >= 0.7 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">
              Detected: <span className="font-bold">{currentGesture}</span> ({Math.round(confidence * 100)}%)
            </span>
          </div>
        </motion.div>
      )}

      {/* Device Cards Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DeviceCard
          title="Living Room Lights"
          icon={Lightbulb}
          isActive={devices.lights}
          onClick={() => setDevices(prev => ({ ...prev, lights: !prev.lights }))}
          gesture="☝️ Point Up / 👎 Thumbs Down"
          description="Smart LED lighting system"
        />
        
        <DeviceCard
          title="Smart Door Lock"
          icon={devices.lock ? Lock : Unlock}
          isActive={devices.lock}
          onClick={() => setDevices(prev => ({ ...prev, lock: !prev.lock }))}
          gesture="✊ Fist to Lock"
          description="Secure entry system"
        />
        
        <DeviceCard
          title="Ceiling Fan"
          icon={Fan}
          isActive={devices.fan}
          onClick={() => setDevices(prev => ({ ...prev, fan: !prev.fan }))}
          gesture="✋ Open Palm"
          description="Smart climate control"
        />
      </div>

      {/* Status Summary */}
      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">System Status</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className={`font-bold ${devices.lights ? 'text-yellow-400' : 'text-gray-500'}`}>
              {devices.lights ? 'ON' : 'OFF'}
            </div>
            <div className="text-gray-400">Lights</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${devices.lock ? 'text-red-400' : 'text-green-400'}`}>
              {devices.lock ? 'LOCKED' : 'UNLOCKED'}
            </div>
            <div className="text-gray-400">Security</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${devices.fan ? 'text-blue-400' : 'text-gray-500'}`}>
              {devices.fan ? 'ON' : 'OFF'}
            </div>
            <div className="text-gray-400">Climate</div>
          </div>
        </div>
      </div>

      {/* Gesture Guide */}
      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Gesture Controls:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div>• ☝️ Point Up → Lights ON</div>
          <div>• 👎 Thumbs Down → Lights OFF</div>
          <div>• ✊ Fist → Lock Door</div>
          <div>• ✋ Open Palm → Toggle Fan</div>
        </div>
      </div>
    </div>
  )
}

export default SmartHomePanel