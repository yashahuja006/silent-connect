import React from 'react'
import Header from './components/Header'
import VideoFeed from './components/VideoFeed'
import ConversationLog from './components/ConversationLog'
import VoiceControls from './components/VoiceControls'
import CompatibilityChecker from './components/CompatibilityChecker'
import { Message } from './types'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'

function App() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [currentGesture, setCurrentGesture] = React.useState<string | null>(null)
  const [confidence, setConfidence] = React.useState<number>(0)
  const [error, setError] = React.useState<string | null>(null)
  const [isCompatible, setIsCompatible] = React.useState<boolean | null>(null)
  
  const { speak, isSpeaking } = useSpeechSynthesis()

  const handleGestureDetected = (gesture: string, confidence: number) => {
    setCurrentGesture(gesture)
    setConfidence(confidence)
    
    // Add gesture message to conversation and trigger speech
    if (confidence >= 70) {
      const message: Message = {
        id: Date.now().toString(),
        type: 'gesture',
        content: gesture,
        timestamp: new Date(),
        confidence,
        sender: 'user'
      }
      setMessages(prev => [...prev, message])
      
      // Trigger text-to-speech for gesture
      speak(gesture)
    }
  }

  const handleSpeechDetected = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'speech',
      content: text,
      timestamp: new Date(),
      sender: 'user'
    }
    setMessages(prev => [...prev, message])
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000)
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Compatibility Checker */}
      {isCompatible === null && (
        <CompatibilityChecker onCompatibilityChecked={setIsCompatible} />
      )}
      
      <Header />
      
      {/* Global Error Display */}
      {error && (
        <div className="bg-red-900/80 border-b border-red-500/30 px-6 py-3">
          <div className="text-red-300">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Video Feed */}
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
        
        {/* Right Panel - Conversation Log */}
        <div className="flex-1 p-4">
          <ConversationLog messages={messages} />
        </div>
      </div>
      
      {/* Speech Synthesis Status */}
      {isSpeaking && (
        <div className="fixed bottom-4 right-4 bg-cyber-cyan/20 border border-cyber-cyan rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2 text-cyber-cyan">
            <div className="animate-pulse">🔊</div>
            <span>Speaking...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App