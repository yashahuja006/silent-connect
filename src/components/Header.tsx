import React, { useState, useEffect } from 'react'
import { SUPPORTED_LANGUAGES } from '../utils/translations'

interface HeaderProps {
  language: string
  onLanguageChange: (language: string) => void
  voiceType?: string
  onVoiceTypeChange?: (voiceType: string) => void
  speechEnabled?: boolean
  onSpeechToggle?: (enabled: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ 
  language, 
  onLanguageChange,
  voiceType = 'male',
  onVoiceTypeChange,
  speechEnabled = true,
  onSpeechToggle
}) => {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      setAvailableVoices(voices)
    }

    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const handleLanguageChange = (newLanguage: string) => {
    console.log(`🌍 Language changing from ${language} to ${newLanguage}`)
    
    // Save to localStorage immediately
    localStorage.setItem('silent-connect-language', newLanguage)
    
    // Show refreshing state
    setIsRefreshing(true)
    
    // Refresh page to ensure all components reinitialize properly
    setTimeout(() => {
      console.log('🔄 Refreshing page for language change...')
      window.location.reload()
    }, 500) // Slightly longer delay to show loading state
  }

  const handleVoiceTypeChange = (newVoiceType: string) => {
    console.log(`🎙️ Voice type changing from ${voiceType} to ${newVoiceType}`)
    
    // Save to localStorage immediately
    localStorage.setItem('silent-connect-voice-type', newVoiceType)
    
    // Show refreshing state
    setIsRefreshing(true)
    
    // Refresh page to ensure voice system reinitializes properly
    setTimeout(() => {
      console.log('🔄 Refreshing page for voice type change...')
      window.location.reload()
    }, 500) // Slightly longer delay to show loading state
  }

  const voiceTypes = [
    { value: 'male', label: '👨 Male', icon: '♂️' },
    { value: 'female', label: '👩 Female', icon: '♀️' },
    { value: 'ai', label: '🤖 AI/Robotic', icon: '🤖' },
    { value: 'auto', label: '🎯 Auto-Select', icon: '⚡' }
  ]

  return (
    <header className="cyber-glass-card border-b border-white/10 px-6 py-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="text-2xl font-bold neon-gradient-text cyber-heading glitch-logo"
            data-text="Silent-Connect"
          >
            Silent-Connect
          </div>
          <div className="neon-button-secondary px-2 py-1 text-xs font-medium">
            v2.2
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          {/* Refreshing Indicator */}
          {isRefreshing && (
            <div className="flex items-center space-x-2 text-cyan-400">
              <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
              <span className="text-xs">Refreshing...</span>
            </div>
          )}

          {/* Speech Toggle */}
          <div className="flex items-center space-x-2">
            <span className="cyber-subtext">Speech:</span>
            <button
              onClick={() => onSpeechToggle?.(!speechEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                speechEnabled 
                  ? 'bg-cyan-500 shadow-lg shadow-cyan-500/30' 
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  speechEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs ${speechEnabled ? 'text-cyan-400' : 'cyber-subtext'}`}>
              {speechEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Voice Type Selector */}
          {speechEnabled && (
            <div className="flex items-center space-x-2">
              <span className="cyber-subtext">Voice:</span>
              <select
                value={voiceType}
                onChange={(e) => handleVoiceTypeChange(e.target.value)}
                disabled={isRefreshing}
                className="cyber-glass-card text-gray-100 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 cursor-pointer cyber-glow-hover disabled:opacity-50"
              >
                {voiceTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <span className="cyber-subtext">Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isRefreshing}
              className="cyber-glass-card text-gray-100 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 cursor-pointer cyber-glow-hover disabled:opacity-50"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-800">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
            <span className="cyber-subtext">Latency: ~8ms</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="cyber-subtext">Status:</span>
            <span className="neon-gradient-text font-medium">Active</span>
          </div>

          <div className="cyber-subtext font-medium">
            🏆 Hackathon Ready
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header