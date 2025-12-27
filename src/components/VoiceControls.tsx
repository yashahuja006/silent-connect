import React, { useEffect } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

interface VoiceControlsProps {
  onSpeechDetected: (text: string) => void
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ onSpeechDetected }) => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    error 
  } = useSpeechRecognition()

  useEffect(() => {
    // Send transcript to parent when speech is detected
    if (transcript && transcript.trim()) {
      onSpeechDetected(transcript.trim())
    }
  }, [transcript, onSpeechDetected])

  const handleMicrophoneToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="cyber-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyber-cyan">Voice Engine</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
          }`} />
          <span className="text-sm text-gray-300">
            {isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Microphone Control */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleMicrophoneToggle}
          className={`cyber-button flex items-center space-x-2 ${
            isListening 
              ? 'bg-red-600 border-red-500 text-white hover:bg-red-700' 
              : 'cyber-button'
          }`}
          disabled={!!error}
          aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
          aria-pressed={isListening}
        >
          <span className="text-xl" aria-hidden="true">
            {isListening ? '🔴' : '🎤'}
          </span>
          <span>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </span>
        </button>

        {isListening && (
          <div className="flex items-center space-x-2 text-cyber-cyan">
            <div className="animate-pulse">●</div>
            <span className="text-sm">Recording...</span>
          </div>
        )}
      </div>

      {/* Live Transcript Display */}
      {transcript && (
        <div className="mb-4" role="region" aria-label="Live speech transcript">
          <div className="subtitle-text" aria-live="polite">
            {transcript}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg">
          <div className="text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
          <div className="text-red-400 text-xs mt-1">
            Please check microphone permissions and try again.
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-400 space-y-1">
        <div>• Click the microphone to start voice recognition</div>
        <div>• Speak clearly for best results</div>
        <div>• Text will appear in large, high-contrast format</div>
        <div>• Your speech will be added to the conversation log</div>
      </div>

      {/* Browser Compatibility Notice */}
      {!('webkitSpeechRecognition' in globalThis) && !('SpeechRecognition' in globalThis) && (
        <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-300 text-sm">
            <strong>Notice:</strong> Speech recognition may not be fully supported in this browser.
            For best results, use Chrome or Edge.
          </div>
        </div>
      )}
    </div>
  )
}

export default VoiceControls