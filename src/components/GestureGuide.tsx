import React from 'react'
import { translateGesture } from '../utils/translations'

interface GestureGuideProps {
  language: string
}

const GestureGuide: React.FC<GestureGuideProps> = ({ language }) => {
  const gestures = [
    { name: 'Hello', emoji: '🤙', description: 'Greeting and acknowledgment' },
    { name: 'Peace', emoji: '✌️', description: 'Victory sign or peaceful intentions' },
    { name: 'Thumbs Up', emoji: '👍', description: 'Approval, agreement, or positive response' },
    { name: 'OK', emoji: '👌', description: 'Perfect, fine, or everything is good' },
    { name: 'Open Palm', emoji: '✋', description: 'Wait, stop, or asking for attention' },
    { name: 'Fist', emoji: '✊', description: 'Strength, power, or solidarity' },
    { name: 'Point Up', emoji: '☝️', description: 'Important point or drawing attention' },
    { name: 'Stop', emoji: '🛑', description: 'Stop, enough, or no more' },
    { name: 'Thank You', emoji: '🙏', description: 'Gratitude and appreciation' },
    { name: 'Yes', emoji: '🤘', description: 'Rock on, cool, or awesome' },
    { name: 'No', emoji: '👎', description: 'Disapproval or negative response' },
    { name: 'Help', emoji: '🤟', description: 'I love you, care, or support' }
  ]

  return (
    <div className="dark-glass-panel p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold neon-gradient-text cyber-heading">Sign Language Guide</h2>
        <div className="text-sm cyber-subtext">
          {gestures.length} gestures available
        </div>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {gestures.map((gesture) => (
          <div 
            key={gesture.name}
            className="cyber-glass-card p-4 hover:cyber-glow-hover transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{gesture.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">
                  {translateGesture(gesture.name, language)}
                </div>
                <div className="text-sm cyber-subtext">
                  {gesture.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 cyber-glass-card">
        <div className="text-sm cyber-subtext space-y-2">
          <div className="font-medium text-white mb-2">💡 How to Use:</div>
          <div>• Hold your hand clearly in front of the camera</div>
          <div>• Make the gesture and hold steady for 1 second</div>
          <div>• The AI will recognize and speak the meaning</div>
          <div>• Wait 2 seconds between different gestures</div>
        </div>
      </div>
    </div>
  )
}

export default GestureGuide