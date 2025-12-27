import React, { useState } from 'react'

interface DemoModeProps {
  onGestureDetected: (gesture: string, confidence: number) => void
}

const DemoMode: React.FC<DemoModeProps> = ({ onGestureDetected }) => {
  const [selectedGesture, setSelectedGesture] = useState<string>('')

  const demoGestures = [
    { name: 'Hello/Hi', emoji: '👋', description: 'Open Palm' },
    { name: 'Yes', emoji: '✊', description: 'Closed Fist' },
    { name: 'No', emoji: '👎', description: 'Thumbs Down' },
    { name: 'Peace/Victory', emoji: '✌️', description: 'Peace Sign' },
    { name: 'I have a question', emoji: '☝️', description: 'Index Pointing Up' }
  ]

  const handleGestureClick = (gesture: string) => {
    setSelectedGesture(gesture)
    onGestureDetected(gesture, 0.95)
    
    // Trigger speech synthesis
    if ('speechSynthesis' in globalThis) {
      const utterance = new SpeechSynthesisUtterance(gesture)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      globalThis.speechSynthesis.speak(utterance)
    }
    
    // Clear selection after 2 seconds
    setTimeout(() => setSelectedGesture(''), 2000)
  }

  return (
    <div className="cyber-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyber-cyan">Demo Mode</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-300">Fallback Mode</span>
        </div>
      </div>

      <div className="flex-1 bg-cyber-darker rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-cyber-teal text-lg mb-2">🎭</div>
          <div className="text-cyber-teal mb-4">
            MediaPipe is taking too long to load. Try these demo gestures:
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {demoGestures.map((gesture) => (
            <button
              key={gesture.name}
              onClick={() => handleGestureClick(gesture.name)}
              className={`cyber-button flex items-center justify-between p-4 text-left transition-all ${
                selectedGesture === gesture.name 
                  ? 'bg-cyber-cyan text-cyber-dark animate-pulse' 
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{gesture.emoji}</span>
                <div>
                  <div className="font-medium">{gesture.description}</div>
                  <div className="text-sm opacity-75">→ "{gesture.name}"</div>
                </div>
              </div>
              {selectedGesture === gesture.name && (
                <div className="text-sm font-medium">Speaking...</div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <div>Click any gesture to test speech synthesis</div>
          <div className="mt-2">
            <button
              onClick={() => window.location.reload()}
              className="text-cyber-cyan hover:text-cyber-teal underline"
            >
              Refresh to retry MediaPipe loading
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoMode