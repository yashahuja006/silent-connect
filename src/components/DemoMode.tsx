import React, { useState } from 'react'

interface DemoModeProps {
  onGestureDetected: (gesture: string, confidence: number) => void
}

const DemoMode: React.FC<DemoModeProps> = ({ onGestureDetected }) => {
  const [selectedGesture, setSelectedGesture] = useState<string>('')

  const demoGestures = [
    { name: 'Hello', emoji: '👋', description: 'Open Palm' },
    { name: 'Yes', emoji: '✊', description: 'Closed Fist' },
    { name: 'Good', emoji: '👍', description: 'Thumbs Up' },
    { name: 'No', emoji: '👎', description: 'Thumbs Down' },
    { name: 'Peace', emoji: '✌️', description: 'Victory Sign' },
    { name: 'Question', emoji: '☝️', description: 'Point Up' },
    { name: 'Call me', emoji: '🤙', description: 'Call Me' },
    { name: 'Love', emoji: '🤟', description: 'I Love You' },
    { name: 'Rock', emoji: '🤘', description: 'Rock On' },
    { name: 'Okay', emoji: '👌', description: 'OK Sign' },
    { name: 'Stop', emoji: '✋', description: 'Stop Hand' },
    { name: 'Thanks', emoji: '🙏', description: 'Praying Hands' }
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
    <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">Demo Mode</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-300">Fallback Mode</span>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/80 rounded-lg p-6 border border-slate-700/50">
        <div className="text-center mb-6">
          <div className="text-teal-400 text-lg mb-2">🎭</div>
          <div className="text-teal-400 mb-4">
            MediaPipe is taking too long to load. Try these demo gestures:
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {demoGestures.map((gesture) => (
            <button
              key={gesture.name}
              onClick={() => handleGestureClick(gesture.name)}
              className={`bg-slate-700/50 backdrop-blur-md border border-slate-600/30 hover:border-cyan-500/50 rounded-lg flex items-center justify-between p-4 text-left transition-all ${
                selectedGesture === gesture.name 
                  ? 'bg-cyan-600/30 border-cyan-400/50 text-cyan-100 animate-pulse' 
                  : 'text-gray-100 hover:bg-slate-600/50'
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
                <div className="text-sm font-medium text-cyan-300">Speaking...</div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <div>Click any gesture to test speech synthesis</div>
          <div className="mt-2">
            <button
              onClick={() => globalThis.location.reload()}
              className="text-cyan-400 hover:text-teal-400 underline"
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