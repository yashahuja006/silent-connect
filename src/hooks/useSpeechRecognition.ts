import { useState, useRef, useEffect } from 'react'
import { SpeechRecognitionResult } from '../types'

// Extend the globalThis interface to include webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export const useSpeechRecognition = (): SpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)
    }

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    isInitialized.current = true

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  const startListening = () => {
    if (!isInitialized.current || !recognitionRef.current) {
      setError('Speech recognition not initialized')
      return
    }

    try {
      setTranscript('')
      setError(null)
      recognitionRef.current.start()
    } catch (err) {
      setError(`Failed to start listening: ${err}`)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
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