import { useState, useRef, useEffect } from 'react'
import { SpeechRecognitionResult } from '../types'

// Extend the globalThis interface to include webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
  
  var webkitSpeechRecognition: any
  var SpeechRecognition: any
}

export const useSpeechRecognition = (language: string = 'en-US'): SpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser')
      return
    }

    console.log(`🎤 Initializing speech recognition for language: ${language}`)

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    console.log(`🌍 Speech recognition language set to: ${recognition.lang}`)

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      console.log(`🎙️ Speech recognition started for ${language}`)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart
        } else {
          interimTranscript += transcriptPart
        }
      }

      // Only update with final transcript or show interim for live display
      if (finalTranscript) {
        setTranscript(finalTranscript)
        console.log(`📝 Final transcript (${language}): ${finalTranscript}`)
      } else if (interimTranscript) {
        setTranscript(interimTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
      console.error(`❌ Speech recognition error for ${language}:`, event.error)
    }

    recognition.onend = () => {
      setIsListening(false)
      console.log(`🛑 Speech recognition ended for ${language}`)
    }

    // Stop previous recognition if it exists
    if (recognitionRef.current && isListening) {
      console.log('🔄 Stopping previous recognition to switch language')
      recognitionRef.current.stop()
    }

    recognitionRef.current = recognition
    isInitialized.current = true

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [language]) // Language dependency will reinitialize when changed

  const startListening = () => {
    if (!isInitialized.current || !recognitionRef.current) {
      setError('Speech recognition not initialized')
      console.error('❌ Speech recognition not initialized')
      return
    }

    try {
      setTranscript('')
      setError(null)
      console.log(`🎤 Starting speech recognition for ${language}`)
      recognitionRef.current.start()
    } catch (err) {
      setError(`Failed to start listening: ${err}`)
      console.error('❌ Failed to start speech recognition:', err)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log(`🛑 Stopping speech recognition for ${language}`)
      recognitionRef.current.stop()
    }
  }

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error
  }
}