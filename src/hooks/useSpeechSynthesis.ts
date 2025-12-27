import { useState, useRef } from 'react'
import { SpeechSynthesisResult } from '../types'

export const useSpeechSynthesis = (): SpeechSynthesisResult => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = (text: string) => {
    if (!('speechSynthesis' in globalThis)) {
      setError('Speech synthesis not supported in this browser')
      return
    }

    try {
      // Cancel any ongoing speech
      globalThis.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      utterance.lang = 'en-US'

      utterance.onstart = () => {
        setIsSpeaking(true)
        setError(null)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        currentUtterance.current = null
      }

      utterance.onerror = (event) => {
        setError(`Speech synthesis error: ${event.error}`)
        setIsSpeaking(false)
        currentUtterance.current = null
      }

      currentUtterance.current = utterance
      globalThis.speechSynthesis.speak(utterance)
      
    } catch (err) {
      setError(`Failed to speak: ${err}`)
      setIsSpeaking(false)
    }
  }

  const cancel = () => {
    if ('speechSynthesis' in globalThis) {
      globalThis.speechSynthesis.cancel()
      setIsSpeaking(false)
      currentUtterance.current = null
    }
  }

  return {
    speak,
    isSpeaking,
    cancel,
    error
  }
}