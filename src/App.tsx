import React, { useRef, useCallback, useState } from 'react'
import Header from './components/Header'
import VideoFeed from './components/VideoFeed'
import ConversationLog from './components/ConversationLog'
import VoiceControls from './components/VoiceControls'
import PracticeMode from './components/PracticeMode'
import { Message } from './types'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { translateGesture } from './utils/translations'

function App() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [currentGesture, setCurrentGesture] = React.useState<string | null>(null)
  const [confidence, setConfidence] = React.useState<number>(0)
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [language, setLanguage] = useState('en-US') // Default language
  
  const { speak, isSpeaking } = useSpeechSynthesis(language)
  
  // DEBOUNCE/COOLDOWN MECHANISM: Prevent duplicate gestures
  const gestureCooldowns = useRef<Map<string, number>>(new Map())
  const COOLDOWN_DURATION = 2000 // 2.0 seconds as requested

  const handleGestureDetected = useCallback((gesture: string, confidence: number) => {
    setCurrentGesture(gesture)
    setConfidence(confidence)
    
    // Only add to conversation log in Translation Mode
    if (!isPracticeMode && confidence >= 70) {
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
        
        // Trigger speech synthesis with translated gesture
        const translatedGesture = translateGesture(gesture, language)
        speak(translatedGesture)
        
        // Set cooldown for this specific gesture
        gestureCooldowns.current.set(gesture, now)
        
        console.log(`✅ Gesture "${gesture}" triggered (cooldown: ${COOLDOWN_DURATION}ms)`)
      } else {
        const remainingCooldown = COOLDOWN_DURATION - (now - lastTriggered)
        console.log(`⏳ Gesture "${gesture}" in cooldown (${remainingCooldown}ms remaining)`)
      }
    }
  }, [speak, confidence, isPracticeMode])

  const handleSpeechDetected = useCallback((text: string) => {
    // Only add to conversation log in Translation Mode
    if (!isPracticeMode) {
      const message: Message = {
        id: `speech-${Date.now()}`,
        type: 'speech',
        content: text,
        timestamp: new Date(),
        sender: 'user'
      }
      setMessages(prev => [...prev, message])
    }
  }, [isPracticeMode])

  return (
    <div className="min-h-screen bg-cyber-animated text-white">
      <Header language={language} onLanguageChange={setLanguage} />
      
      {/* Mode Toggle Button */}
      <div className="fixed top-20 right-4 z-30">
        <button
          onClick={() => setIsPracticeMode(!isPracticeMode)}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg ${
            isPracticeMode 
              ? 'bg-green-600 hover:bg-green-500 border border-green-400 text-white' 
              : 'bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white'
          }`}
        >
          {isPracticeMode ? '🎮 Practice Mode' : '💬 Translation Mode'}
        </button>
      </div>
      
      {/* RESPONSIVE LAYOUT: Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Video Feed Panel */}
        <div className="flex-1 p-4">
          <div className="h-full flex flex-col space-y-4">
            <VideoFeed 
              onGestureDetected={handleGestureDetected}
              currentGesture={currentGesture}
              confidence={confidence}
              language={language}
            />
            {!isPracticeMode && (
              <VoiceControls 
                onSpeechDetected={handleSpeechDetected}
                language={language}
              />
            )}
          </div>
        </div>
        
        {/* Right Panel - Conversation Log or Practice Mode */}
        <div className="flex-1 p-4">
          {isPracticeMode ? (
            <PracticeMode 
              currentGesture={currentGesture}
              confidence={confidence}
              language={language}
            />
          ) : (
            <ConversationLog messages={messages} />
          )}
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
      {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && !isPracticeMode && (
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