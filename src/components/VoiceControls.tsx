import React, { useEffect, useRef } from 'react'
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

  const lastSentTranscript = useRef<string>('')
  const transcriptTimeout = useRef<number | null>(null)

  useEffect(() => {
    // Only send transcript when it's final and different from last sent
    if (transcript && transcript.trim() && transcript !== lastSentTranscript.current) {
      
      // Clear any existing timeout
      if (transcriptTimeout.current) {
        clearTimeout(transcriptTimeout.current)
      }
      
      // Set a timeout to send the transcript after user stops speaking
      transcriptTimeout.current = window.setTimeout(() => {
        const finalText = transcript.trim()
        if (finalText && finalText !== lastSentTranscript.current) {
          onSpeechDetected(finalText)
          lastSentTranscript.current = finalText
        }
      }, 1500) // Wait 1.5 seconds after last change
    }

    return () => {
      if (transcriptTimeout.current) {
        clearTimeout(transcriptTimeout.current)
      }
    }
  }, [transcript, onSpeechDetected])

  const handleMicrophoneToggle = () => {
    if (isListening) {
      stopListening()
      // Reset when stopping
      lastSentTranscript.current = ''
      if (transcriptTimeout.current) {
        clearTimeout(transcriptTimeout.current)
      }
    } else {
      startListening()
      lastSentTranscript.current = ''
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
      {transcript && isListening && (
        <div className="mb-4" role="region" aria-label="Live speech transcript">
          <div className="text-xs text-gray-400 mb-1">Live transcript:</div>
          <div className="subtitle-text" aria-live="polite">
            {transcript}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {transcript.length > 0 ? 'Stop speaking to add to conversation...' : ''}
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
        <div>• Speak clearly and pause when finished</div>
        <div>• Text will be added to conversation after you stop speaking</div>
        <div>• Large text appears for accessibility</div>
      </div>

      {/* Browser Compatibility Notice */}
      {!((globalThis as any).webkitSpeechRecognition) && !((globalThis as any).SpeechRecognition) && (
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