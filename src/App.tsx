import React, { useRef, useCallback, useState, useEffect } from 'react'
import Header from './components/Header'
import VideoFeed from './components/VideoFeed'
import ConversationLog from './components/ConversationLog'
import VoiceControls from './components/VoiceControls'
import PracticeMode from './components/PracticeMode'
import SmartHomePanel from './components/SmartHomePanel'
import RehabDashboard from './components/RehabDashboard'
import GestureTrainer from './components/GestureTrainer'
import GestureGuide from './components/GestureGuide'
import { Message } from './types'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { translateGesture } from './utils/translations'
import { MessageCircle, GraduationCap, Home, Activity, Brain, Menu, X, BookOpen } from 'lucide-react'

function App() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [currentGesture, setCurrentGesture] = React.useState<string | null>(null)
  const [confidence, setConfidence] = React.useState<number>(0)
  const [landmarks, setLandmarks] = React.useState<any[] | null>(null)
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [language, setLanguage] = useState(() => {
    // Load language from localStorage or default to 'en-US'
    return localStorage.getItem('silent-connect-language') || 'en-US'
  })
  const [voiceType, setVoiceType] = useState(() => {
    // Load voice type from localStorage or default to 'male'
    return localStorage.getItem('silent-connect-voice-type') || 'male'
  })
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    // Load speech setting from localStorage or default to true
    const saved = localStorage.getItem('silent-connect-speech-enabled')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [activeTab, setActiveTab] = useState<'translator' | 'education' | 'smarthome' | 'health' | 'trainer' | 'guide'>('translator')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleLanguageChange = (newLanguage: string) => {
    console.log(`🌍 Language changing from ${language} to ${newLanguage}`)
    
    // Save to localStorage immediately
    localStorage.setItem('silent-connect-language', newLanguage)
    setLanguage(newLanguage)
    
    // Refresh page to ensure all components reinitialize properly
    setTimeout(() => {
      console.log('🔄 Refreshing page for language change...')
      window.location.reload()
    }, 300) // Reduced delay for faster response
  }

  const handleVoiceTypeChange = (newVoiceType: string) => {
    console.log(`🎙️ Voice type changing from ${voiceType} to ${newVoiceType}`)
    
    // Save to localStorage immediately
    localStorage.setItem('silent-connect-voice-type', newVoiceType)
    setVoiceType(newVoiceType)
    
    // Refresh page to ensure voice system reinitializes properly
    setTimeout(() => {
      console.log('🔄 Refreshing page for voice type change...')
      window.location.reload()
    }, 300) // Reduced delay for faster response
  }

  const handleSpeechToggle = (enabled: boolean) => {
    // Save speech setting to localStorage
    localStorage.setItem('silent-connect-speech-enabled', JSON.stringify(enabled))
    setSpeechEnabled(enabled)
    // No refresh needed for speech toggle - it works immediately
  }

  const { speak, isSpeaking } = useSpeechSynthesis(language, voiceType)
  
  // DEBOUNCE/COOLDOWN MECHANISM: Prevent duplicate gestures
  const gestureCooldowns = useRef<Map<string, number>>(new Map())
  const gestureHoldStart = useRef<Map<string, number>>(new Map()) // Track when gesture started
  const gestureTriggered = useRef<Map<string, boolean>>(new Map()) // Track if gesture already triggered
  const COOLDOWN_DURATION = 800 // Reduced for faster response
  const HOLD_DURATION = 400 // Reduced to 0.4s for much faster triggering

  const handleGestureDetected = useCallback((gesture: string, confidence: number, landmarks?: any[]) => {
    console.log(`🎯 Gesture detected: "${gesture}" with confidence: ${(confidence * 100).toFixed(1)}%`)
    
    setCurrentGesture(gesture)
    setConfidence(confidence)
    setLandmarks(landmarks || null)
    
    // Add to conversation log in Translation Mode OR trigger speech in Demo Mode
    if (confidence >= 0.55) { // Lowered for high-FPS systems
      // Check if we should add to conversation log (translator mode only)
      const shouldAddToLog = activeTab === 'translator' && !isPracticeMode
      
      // Check if we should trigger speech (translator mode OR demo mode)
      const shouldTriggerSpeech = (activeTab === 'translator' && !isPracticeMode) || 
                                  (activeTab === 'education') // Demo mode is in education tab
      
      if (shouldAddToLog || shouldTriggerSpeech) {
        const now = Date.now()
        
        // Check if this gesture was already triggered recently (prevent spam)
        const lastTriggered = gestureCooldowns.current.get(gesture) || 0
        if (now - lastTriggered < COOLDOWN_DURATION) {
          console.log(`⏳ Gesture "${gesture}" still in cooldown (${COOLDOWN_DURATION - (now - lastTriggered)}ms remaining)`)
          return
        }
        
        // Check if this gesture is already triggered in current hold
        if (gestureTriggered.current.get(gesture)) {
          console.log(`🚫 Gesture "${gesture}" already triggered in this hold session`)
          return
        }
        
        // Check if this is a new gesture or continuation of existing gesture
        const currentHoldStart = gestureHoldStart.current.get(gesture)
        
        if (!currentHoldStart) {
          // New gesture detected - start tracking hold time
          gestureHoldStart.current.set(gesture, now)
          gestureTriggered.current.set(gesture, false) // Reset triggered flag
          console.log(`⏱️ Started tracking gesture "${gesture}" - need to hold for ${HOLD_DURATION}ms`)
          return
        }
        
        // Check if gesture has been held long enough
        const holdDuration = now - currentHoldStart
        if (holdDuration >= HOLD_DURATION && !gestureTriggered.current.get(gesture)) {
          
          // Add gesture message to conversation (only in translator mode)
          if (shouldAddToLog) {
            const message: Message = {
              id: `gesture-${now}`,
              type: 'gesture',
              content: gesture,
              timestamp: new Date(),
              confidence,
              sender: 'user'
            }
            
            setMessages(prev => [...prev, message])
          }
          
          // Trigger speech synthesis with translated gesture (if speech is enabled)
          if (speechEnabled && shouldTriggerSpeech) {
            const translatedGesture = translateGesture(gesture, language)
            // Clean up the translation - take only the first meaning to avoid reading multiple words
            const cleanTranslation = translatedGesture.split(',')[0].trim()
            console.log(`🔊 Speaking (${voiceType}): "${cleanTranslation}" (from gesture: "${gesture}" held for ${holdDuration}ms)`)
            speak(cleanTranslation)
          } else {
            console.log(`🔇 Speech disabled or not applicable - gesture "${gesture}" detected but not spoken`)
          }
          
          // Set cooldown and mark as triggered
          gestureCooldowns.current.set(gesture, now)
          gestureTriggered.current.set(gesture, true)
          
          console.log(`✅ Gesture "${gesture}" triggered after ${holdDuration}ms hold (cooldown: ${COOLDOWN_DURATION}ms)`)
        } else if (holdDuration < HOLD_DURATION) {
          const remainingHold = HOLD_DURATION - holdDuration
          console.log(`⏱️ Gesture "${gesture}" held for ${holdDuration}ms, need ${remainingHold}ms more`)
        }
      }
    } else {
      console.log(`❌ Gesture not processed - confidence: ${(confidence * 100).toFixed(1)}% (minimum: 55%)`)
      // Clear hold tracking if conditions not met
      gestureHoldStart.current.delete(gesture)
      gestureTriggered.current.delete(gesture)
    }
  }, [speak, isPracticeMode, activeTab, language, speechEnabled, voiceType])

  // Clear gesture hold tracking when gesture is lost
  useEffect(() => {
    if (!currentGesture) {
      // Clear all hold tracking when no gesture is detected
      gestureHoldStart.current.clear()
      gestureTriggered.current.clear()
    }
  }, [currentGesture])

  const handleSpeechDetected = useCallback((text: string) => {
    // Only add to conversation log in Translation Mode
    if (activeTab === 'translator' && !isPracticeMode) {
      const message: Message = {
        id: `speech-${Date.now()}`,
        type: 'speech',
        content: text,
        timestamp: new Date(),
        sender: 'user'
      }
      setMessages(prev => [...prev, message])
    }
  }, [isPracticeMode, activeTab])

  const navigationItems = [
    { id: 'translator', label: 'Translator', icon: MessageCircle, description: 'Real-time gesture translation' },
    { id: 'guide', label: 'Sign Guide', icon: BookOpen, description: 'Learn gesture meanings' },
    { id: 'education', label: 'Education', icon: GraduationCap, description: 'Quiz Master learning suite' },
    { id: 'smarthome', label: 'Smart Home', icon: Home, description: 'IoT device control' },
    { id: 'health', label: 'Health Data', icon: Activity, description: 'Rehabilitation analytics' },
    { id: 'trainer', label: 'Train AI', icon: Brain, description: 'Custom gesture studio' }
  ]

  const debugItems = [
    { id: 'demo', label: '🎭 Demo Mode', action: () => (window as any).triggerDemoMode?.() },
    { id: 'logs', label: '🔍 Check Logs', action: () => (window as any).triggerCheckLogs?.() },
    { id: 'status', label: '🧪 Test Status', action: () => (window as any).triggerTestStatus?.() },
    { id: 'canvas', label: '🎨 Test Canvas', action: () => (window as any).triggerTestCanvas?.() }
  ]

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'translator':
        return isPracticeMode ? (
          <PracticeMode 
            currentGesture={currentGesture}
            confidence={confidence}
            language={language}
          />
        ) : (
          <ConversationLog messages={messages} />
        )
      case 'guide':
        return (
          <GestureGuide 
            language={language}
          />
        )
      case 'education':
        return (
          <PracticeMode 
            currentGesture={currentGesture}
            confidence={confidence}
            language={language}
          />
        )
      case 'smarthome':
        return (
          <SmartHomePanel 
            currentGesture={currentGesture}
            confidence={confidence}
          />
        )
      case 'health':
        return (
          <RehabDashboard 
            landmarks={landmarks}
            currentGesture={currentGesture}
            confidence={confidence}
          />
        )
      case 'trainer':
        return (
          <GestureTrainer 
            landmarks={landmarks}
            currentGesture={currentGesture}
            confidence={confidence}
          />
        )
      default:
        return <ConversationLog messages={messages} />
    }
  }

  return (
    <div className="min-h-screen cyber-glass-background text-white flex">
      {/* Neural Network Background */}
      <div className="neural-network-bg"></div>
      
      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 dark-glass-panel border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h1 
            className="text-lg font-bold neon-gradient-text cyber-heading glitch-logo" 
            data-text="Silent-Connect"
          >
            Silent-Connect
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden neon-button-secondary p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-4">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                  activeTab === item.id
                    ? 'cyber-active-tab'
                    : 'cyber-glass-card cyber-subtext hover:text-white cyber-glow-hover'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Debug Tools Section */}
          <div className="border-t border-white/10 pt-4">
            <div className="text-xs cyber-subtext mb-2 px-3">Debug Tools</div>
            <div className="space-y-1">
              {debugItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left px-3 py-2 rounded-lg cyber-glass-card cyber-subtext hover:text-white cyber-glow-hover transition-all duration-300 text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 overflow-y-auto">
        <div className="dark-glass-panel m-4 p-6">
          <Header 
            language={language} 
            onLanguageChange={handleLanguageChange}
            voiceType={voiceType}
            onVoiceTypeChange={handleVoiceTypeChange}
            speechEnabled={speechEnabled}
            onSpeechToggle={handleSpeechToggle}
          />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-40 neon-button-secondary p-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Mode Toggle Button (only for translator tab) */}
          {activeTab === 'translator' && (
            <div className="fixed top-20 right-4 z-30">
              <button
                onClick={() => setIsPracticeMode(!isPracticeMode)}
                className={`cyber-neon-button transition-all duration-300 ${
                  isPracticeMode 
                    ? 'neon-button-secondary' 
                    : 'cyber-neon-button'
                }`}
              >
                {isPracticeMode ? '🎯 Practice Mode' : '💬 Chat Mode'}
              </button>
            </div>
          )}
          
          {/* RESPONSIVE LAYOUT: Stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
            {/* Video Feed Panel - Always Active */}
            <div className="flex-1 p-4">
              <div className="flex flex-col space-y-4">
                <div className="dark-glass-panel p-4 vision-engine-active">
                  <VideoFeed 
                    onGestureDetected={handleGestureDetected}
                    currentGesture={currentGesture}
                    confidence={confidence}
                    language={language}
                    onDemoMode={() => console.log('Demo mode activated from sidebar')}
                    onCheckLogs={() => console.log('Check logs activated from sidebar')}
                    onTestStatus={() => console.log('Test status activated from sidebar')}
                    onTestCanvas={() => console.log('Test canvas activated from sidebar')}
                  />
                </div>
                {activeTab === 'translator' && !isPracticeMode && (
                  <div className="cyber-glass-card p-4">
                    <VoiceControls 
                      onSpeechDetected={handleSpeechDetected}
                      language={language}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Panel - Dynamic Content Based on Active Tab */}
            <div className="flex-1 p-4">
              <div className="dark-glass-panel p-4 min-h-[500px]">
                {renderActivePanel()}
              </div>
            </div>
          </div>
          
          {/* Speech Synthesis Status */}
          {isSpeaking && (
            <div className="fixed bottom-4 right-4 cyber-glass-card px-4 py-2">
              <div className="flex items-center space-x-2 neon-gradient-text">
                <div className="animate-pulse">🔊</div>
                <span>Speaking...</span>
              </div>
            </div>
          )}
        </div>
        {/* Debug: Cooldown Status (remove in production) */}
        {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && activeTab === 'translator' && !isPracticeMode && (
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

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default App