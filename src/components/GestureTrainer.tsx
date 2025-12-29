import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Plus, Trash2, Save, Eye, Zap, Target, BookOpen } from 'lucide-react'

interface GestureTrainerProps {
  landmarks: any[] | null
  currentGesture: string | null
  confidence: number
}

interface CustomGesture {
  id: string
  name: string
  landmarks: any[]
  dateCreated: string
  timesDetected: number
}

const GestureTrainer: React.FC<GestureTrainerProps> = ({ landmarks, currentGesture, confidence }) => {
  const [gestureName, setGestureName] = useState('')
  const [customGestures, setCustomGestures] = useState<CustomGesture[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureCountdown, setCaptureCountdown] = useState(0)
  const [detectedCustomGesture, setDetectedCustomGesture] = useState<string | null>(null)

  // Load custom gestures from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('custom-gestures')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCustomGestures(parsed)
      } catch (error) {
        console.error('Failed to load custom gestures:', error)
      }
    }
  }, [])

  // Save custom gestures to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('custom-gestures', JSON.stringify(customGestures))
  }, [customGestures])

  // Calculate Mean Squared Error between two landmark sets
  const calculateMSE = (landmarks1: any[], landmarks2: any[]) => {
    if (!landmarks1 || !landmarks2 || landmarks1.length !== landmarks2.length) {
      return Infinity
    }

    let totalError = 0
    for (let i = 0; i < landmarks1.length; i++) {
      const dx = landmarks1[i].x - landmarks2[i].x
      const dy = landmarks1[i].y - landmarks2[i].y
      totalError += dx * dx + dy * dy
    }

    return totalError / landmarks1.length
  }

  // Check for custom gesture matches
  useEffect(() => {
    if (landmarks && landmarks.length === 21 && customGestures.length > 0) {
      let bestMatch = null
      let bestScore = Infinity

      for (const customGesture of customGestures) {
        const mse = calculateMSE(landmarks, customGesture.landmarks)
        if (mse < bestScore && mse < 0.05) { // Threshold for match
          bestScore = mse
          bestMatch = customGesture
        }
      }

      if (bestMatch && bestMatch.name !== detectedCustomGesture) {
        setDetectedCustomGesture(bestMatch.name)
        
        // Update detection count
        setCustomGestures(prev => 
          prev.map(gesture => 
            gesture.id === bestMatch.id 
              ? { ...gesture, timesDetected: gesture.timesDetected + 1 }
              : gesture
          )
        )
        
        console.log(`🧠 Custom Gesture Detected: ${bestMatch.name} (MSE: ${bestScore.toFixed(4)})`)
      } else if (!bestMatch) {
        setDetectedCustomGesture(null)
      }
    }
  }, [landmarks, customGestures, detectedCustomGesture])

  // Capture gesture with countdown
  const startCapture = () => {
    if (!gestureName.trim()) {
      alert('Please enter a gesture name first!')
      return
    }

    if (!landmarks || landmarks.length !== 21) {
      alert('Please show your hand to the camera first!')
      return
    }

    setIsCapturing(true)
    setCaptureCountdown(3)

    const countdown = setInterval(() => {
      setCaptureCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          captureGesture()
          setIsCapturing(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Capture the current gesture
  const captureGesture = () => {
    if (!landmarks || landmarks.length !== 21) {
      alert('No hand detected! Please try again.')
      return
    }

    const newGesture: CustomGesture = {
      id: Date.now().toString(),
      name: gestureName.trim(),
      landmarks: [...landmarks], // Deep copy
      dateCreated: new Date().toLocaleDateString(),
      timesDetected: 0
    }

    setCustomGestures(prev => [...prev, newGesture])
    setGestureName('')
    
    console.log(`✅ Custom gesture "${newGesture.name}" saved with ${landmarks.length} landmarks`)
  }

  // Delete a custom gesture
  const deleteGesture = (id: string) => {
    setCustomGestures(prev => prev.filter(gesture => gesture.id !== id))
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
          <Brain className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-400">Custom Gesture Studio</h2>
          <p className="text-sm text-gray-400">Teach the AI your own gestures</p>
        </div>
      </div>

      {/* Current Detection Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Detection Status</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${landmarks ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Built-in Gesture:</span>
            <div className="font-medium text-white">
              {currentGesture || 'None detected'}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Custom Gesture:</span>
            <div className="font-medium text-purple-300">
              {detectedCustomGesture || 'None detected'}
            </div>
          </div>
        </div>
      </div>

      {/* Gesture Creation Form */}
      <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create New Gesture</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gesture Name
            </label>
            <input
              type="text"
              value={gestureName}
              onChange={(e) => setGestureName(e.target.value)}
              placeholder="e.g., Water, Coffee, Hello Mom..."
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none"
              disabled={isCapturing}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={startCapture}
              disabled={isCapturing || !gestureName.trim() || !landmarks}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isCapturing || !gestureName.trim() || !landmarks
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isCapturing ? `Capturing in ${captureCountdown}...` : 'Capture Gesture'}</span>
            </button>
            
            {landmarks && (
              <div className="text-xs text-green-400 flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>Hand detected ({landmarks.length} landmarks)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Gestures List */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-200 flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Saved Gestures ({customGestures.length})</span>
          </h3>
        </div>
        
        <div className="h-full overflow-y-auto space-y-3">
          <AnimatePresence>
            {customGestures.map((gesture) => (
              <motion.div
                key={gesture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  detectedCustomGesture === gesture.name
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50'
                    : 'bg-slate-800/50 border-slate-600/30 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-bold ${
                        detectedCustomGesture === gesture.name ? 'text-purple-300' : 'text-white'
                      }`}>
                        {gesture.name}
                      </h4>
                      {detectedCustomGesture === gesture.name && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <Zap className="w-4 h-4 text-purple-400" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>Created: {gesture.dateCreated}</div>
                      <div>Detected: {gesture.timesDetected} times</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteGesture(gesture.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete gesture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {customGestures.length === 0 && (
            <div className="h-32 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No custom gestures yet.</p>
                <p className="text-xs">Create your first gesture above!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
        <h4 className="text-sm font-medium text-gray-300 mb-2">How to Train:</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <div>1. Enter a name for your gesture</div>
          <div>2. Position your hand in the desired gesture</div>
          <div>3. Click "Capture Gesture" and hold steady</div>
          <div>4. The AI will learn to recognize your gesture!</div>
        </div>
      </div>
    </div>
  )
}

export default GestureTrainer