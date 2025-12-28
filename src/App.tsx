import React, { useRef, useCallback } from 'react'
import Header from './components/Header'
import VideoFeed from './components/VideoFeed'
import ConversationLog from './components/ConversationLog'
import VoiceControls from './components/VoiceControls'
import { Message } from './types'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'

function App() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [currentGesture, setCurrentGesture] = React.useState<string | null>(null)
  const [confidence, setConfidence] = React.useState<number>(0)
  
  const { speak, isSpeaking } = useSpeechSynthesis()
  
  // DEBOUNCE/COOLDOWN MECHANISM: Prevent duplicate gestures
  const gestureCooldowns = useRef<Map<string, number>>(new Map())
  const COOLDOWN_DURATION = 2000 // 2.0 seconds as requested

  const handleGestureDetected = useCallback((gesture: string, confidence: number) => {
    setCurrentGesture(gesture)
    setConfidence(confidence)
    
    // CRITICAL: Debounce logic to prevent chat log flooding
    if (confidence >= 70) {
      const now = Date.now()
      const lastTriggered = gestureCooldowns.current.get(gesture) || 0
      
      // Check if gesture is in cooldown period
      if (now - lastTriggered >= COOLDOWN_DURATION) {
        // Add gesture message to conversation
        const message: Message = {
          id: `gesture-${now}`,
          type: 'gesture',
          content: gesture,
          timestamp: new Date(),
          confidence,
          sender: 'user'
        }
        
        setMessages(prev => [...prev, message])
        
        // Trigger speech synthesis
        speak(gesture)
        
        // Set cooldown for this specific gesture
        gestureCooldowns.current.set(gesture, now)
        
        console.log(`✅ Gesture "${gesture}" triggered (cooldown: ${COOLDOWN_DURATION}ms)`)
      } else {
        const remainingCooldown = COOLDOWN_DURATION - (now - lastTriggered)
        console.log(`⏳ Gesture "${gesture}" in cooldown (${remainingCooldown}ms remaining)`)
      }
    }
  }, [speak, confidence])

  const handleSpeechDetected = useCallback((text: string) => {
    const message: Message = {
      id: `speech-${Date.now()}`,
      type: 'speech',
      content: text,
      timestamp: new Date(),
      sender: 'user'
    }
    setMessages(prev => [...prev, message])
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      
      {/* RESPONSIVE LAYOUT: Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Video Feed Panel */}
        <div className="flex-1 p-4">
          <div className="h-full flex flex-col space-y-4">
            <VideoFeed 
              onGestureDetected={handleGestureDetected}
              currentGesture={currentGesture}
              confidence={confidence}
            />
            <VoiceControls onSpeechDetected={handleSpeechDetected} />
          </div>
        </div>
        
        {/* Conversation Log Panel */}
        <div className="flex-1 p-4">
          <ConversationLog messages={messages} />
        </div>
      </div>
      
      {/* Speech Synthesis Status */}
      {isSpeaking && (
        <div className="fixed bottom-4 right-4 bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2 text-cyan-400">
            <div className="animate-pulse">🔊</div>
            <span>Speaking...</span>
          </div>
        </div>
      )}
      
      {/* Debug: Cooldown Status (remove in production) */}
      {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg px-3 py-2 text-xs">
          <div className="text-cyan-400">Gesture Cooldowns:</div>
          {Array.from(gestureCooldowns.current.entries()).map(([gesture, time]) => {
            const remaining = Math.max(0, COOLDOWN_DURATION - (Date.now() - time))
            return (
              <div key={gesture} className="text-gray-300">
                {gesture}: {remaining > 0 ? `${Math.ceil(remaining/1000)}s` : 'Ready'}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default App