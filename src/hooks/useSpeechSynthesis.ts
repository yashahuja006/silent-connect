import { useState, useRef, useEffect } from 'react'
import { SpeechSynthesisResult } from '../types'

export const useSpeechSynthesis = (language: string = 'en-US', voiceType: string = 'male'): SpeechSynthesisResult => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)
  const voicesLoaded = useRef(false)

  // Initialize voices when component mounts OR when language/voiceType changes
  useEffect(() => {
    if ('speechSynthesis' in globalThis) {
      // Force voices to load
      const loadVoices = () => {
        const voices = globalThis.speechSynthesis.getVoices()
        if (voices.length > 0) {
          voicesLoaded.current = true
          console.log(`🎙️ Loaded ${voices.length} voices for language: ${language}`)
          
          // Log available voices for the current language
          const languageVoices = voices.filter(v => v.lang.startsWith(language.split('-')[0]))
          console.log(`🌍 Available voices for ${language}:`, languageVoices.map(v => v.name))
        } else {
          console.log('⏳ Voices not loaded yet, retrying...')
          // Retry loading voices
          setTimeout(loadVoices, 100)
        }
      }

      // Try multiple methods to ensure voices are loaded
      loadVoices()
      
      // Trigger voice loading by speaking empty text (silent)
      const silentUtterance = new SpeechSynthesisUtterance('')
      silentUtterance.volume = 0
      globalThis.speechSynthesis.speak(silentUtterance)

      // Also listen for the voiceschanged event
      globalThis.speechSynthesis.addEventListener('voiceschanged', loadVoices)

      return () => {
        globalThis.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [language, voiceType]) // Add dependencies so it re-runs when language/voiceType changes

  const speak = (text: string) => {
    if (!('speechSynthesis' in globalThis)) {
      setError('Speech synthesis not supported in this browser')
      return
    }

    try {
      // Only cancel if we're currently speaking something different
      if (currentUtterance.current && isSpeaking) {
        const currentText = currentUtterance.current.text
        if (currentText !== text) {
          globalThis.speechSynthesis.cancel()
        } else {
          // Same text is already being spoken, don't interrupt
          return
        }
      }

      // Wait for speech synthesis to be ready
      const speakWhenReady = () => {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Voice settings optimized for clarity
        const voiceSettings = getVoiceSettings(voiceType)
        utterance.rate = voiceSettings.rate * 0.85 // Slower for better clarity
        utterance.pitch = voiceSettings.pitch
        utterance.volume = voiceSettings.volume
        utterance.lang = language

        // Enhanced voice selection
        const voices = globalThis.speechSynthesis.getVoices()
        console.log(`🔍 Selecting voice for language: ${language}, type: ${voiceType}`)
        
        const selectedVoice = findBestVoice(voices, language, voiceType)
        if (selectedVoice) {
          utterance.voice = selectedVoice
          console.log(`🎙️ Selected ${voiceType} voice: ${selectedVoice.name} (${selectedVoice.lang})`)
        } else {
          console.log(`⚠️ No ${voiceType} voice found for ${language}, using browser default`)
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          setError(null)
          console.log(`🔊 Speaking (${voiceType}): "${text}"`)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          currentUtterance.current = null
          console.log(`✅ Finished speaking: "${text}"`)
        }

        utterance.onerror = (event) => {
          setError(`Speech error: ${event.error}`)
          setIsSpeaking(false)
          currentUtterance.current = null
          console.error(`❌ Speech error: ${event.error}`)
        }

        currentUtterance.current = utterance
        
        // Speak immediately - the delay is handled by the outer timeout
        globalThis.speechSynthesis.speak(utterance)
      }

      // Use a longer delay to ensure speech synthesis is fully ready
      if (voicesLoaded.current) {
        // Voices are loaded, but still give a small delay for browser readiness
        setTimeout(speakWhenReady, 200)
      } else {
        // Voices not loaded yet, wait longer
        setTimeout(() => {
          // Try to load voices again
          const voices = globalThis.speechSynthesis.getVoices()
          if (voices.length > 0) {
            voicesLoaded.current = true
          }
          speakWhenReady()
        }, 500)
      }
      
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

// Get voice settings based on voice type
const getVoiceSettings = (voiceType: string) => {
  switch (voiceType) {
    case 'male':
      return {
        rate: 0.9, // Slower for clarity
        pitch: 0.8, // Lower pitch for masculine voice
        volume: 1
      }
    case 'female':
      return {
        rate: 0.95, // Slower for clarity
        pitch: 1.2, // Higher pitch for feminine voice
        volume: 1
      }
    case 'ai':
      return {
        rate: 1.0, // Normal rate for AI
        pitch: 0.6, // Very low pitch for AI/robotic voice
        volume: 1
      }
    case 'auto':
    default:
      return {
        rate: 0.9, // Slower default for clarity
        pitch: 1.0, // Default settings
        volume: 1
      }
  }
}

// Enhanced voice selection function
const findBestVoice = (voices: SpeechSynthesisVoice[], language: string, voiceType: string): SpeechSynthesisVoice | null => {
  if (voices.length === 0) {
    console.log('❌ No voices available')
    return null
  }

  console.log(`🔍 Finding ${voiceType} voice for language: ${language}`)
  console.log(`📋 Total voices available: ${voices.length}`)

  // Filter voices by language first
  const languageCode = language.split('-')[0] // e.g., 'en' from 'en-US'
  const languageVoices = voices.filter(v => v.lang.startsWith(languageCode))
  
  console.log(`🌍 Voices for ${languageCode}:`, languageVoices.map(v => `${v.name} (${v.lang})`))
  
  if (languageVoices.length === 0) {
    console.log(`⚠️ No voices found for ${language}, falling back to English`)
    // Fallback to any English voice if language not found
    const englishVoices = voices.filter(v => v.lang.startsWith('en'))
    console.log(`🇺🇸 English fallback voices:`, englishVoices.map(v => v.name))
    return englishVoices[0] || voices[0] || null
  }

  let selectedVoice: SpeechSynthesisVoice | null = null

  switch (voiceType) {
    case 'male':
      selectedVoice = findMaleVoice(languageVoices, language)
      break
    case 'female':
      selectedVoice = findFemaleVoice(languageVoices, language)
      break
    case 'ai':
      selectedVoice = findAIVoice(languageVoices, language)
      break
    case 'auto':
    default:
      selectedVoice = languageVoices[0] || null
      break
  }

  if (selectedVoice) {
    console.log(`✅ Selected voice: ${selectedVoice.name} (${selectedVoice.lang}) for ${voiceType} type`)
  } else {
    console.log(`❌ No ${voiceType} voice found, using first available for language`)
    selectedVoice = languageVoices[0] || null
  }

  return selectedVoice
}

// Find male voice
const findMaleVoice = (voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | null => {
  // Language-specific male preferences (updated for user's specific browser voices)
  const preferences: { [key: string]: string[] } = {
    'en-US': ['Microsoft David', 'Microsoft Mark'],
    'en-GB': ['Google UK English Male'],
    'es-ES': ['Google español'],
    'es-US': ['Google español de Estados Unidos'],
    'fr-FR': ['Google français'],
    'ja-JP': ['Google 日本語'],
    'hi-IN': ['Google हिन्दी'],
    'de-DE': ['Google Deutsch']
  }

  // Try exact language-specific preferences first
  const langPrefs = preferences[language] || []
  for (const pref of langPrefs) {
    const voice = voices.find(v => v.name === pref)
    if (voice) {
      console.log(`✅ Found exact preferred male voice: ${voice.name}`)
      return voice
    }
  }

  // Try partial matches for language preferences
  for (const pref of langPrefs) {
    const voice = voices.find(v => v.name.includes(pref))
    if (voice) {
      console.log(`✅ Found partial match male voice: ${voice.name}`)
      return voice
    }
  }

  // Male keywords for fallback
  const maleKeywords = ['david', 'mark', 'male', 'man', 'masculine']
  
  for (const keyword of maleKeywords) {
    const voice = voices.find(v => v.name.toLowerCase().includes(keyword))
    if (voice) {
      console.log(`✅ Found male voice by keyword: ${voice.name}`)
      return voice
    }
  }

  // Exclude female voices as last resort
  const femaleKeywords = ['female', 'woman', 'zira', 'cortana', 'siri']
  const nonFemaleVoices = voices.filter(v => 
    !femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
  )

  return nonFemaleVoices[0] || voices[0] || null
}

// Find female voice
const findFemaleVoice = (voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | null => {
  // Language-specific female preferences (updated for user's specific browser voices)
  const preferences: { [key: string]: string[] } = {
    'en-US': ['Microsoft Zira'],
    'en-GB': ['Google UK English Female'],
    'es-ES': ['Google español'], // Will use same voice but with higher pitch
    'es-US': ['Google español de Estados Unidos'],
    'fr-FR': ['Google français'],
    'ja-JP': ['Google 日本語'],
    'hi-IN': ['Google हिन्दी'],
    'de-DE': ['Google Deutsch']
  }

  // Try exact language-specific preferences first
  const langPrefs = preferences[language] || []
  for (const pref of langPrefs) {
    const voice = voices.find(v => v.name === pref)
    if (voice) {
      console.log(`✅ Found exact preferred female voice: ${voice.name}`)
      return voice
    }
  }

  // Try partial matches for language preferences
  for (const pref of langPrefs) {
    const voice = voices.find(v => v.name.includes(pref))
    if (voice) {
      console.log(`✅ Found partial match female voice: ${voice.name}`)
      return voice
    }
  }

  // Female keywords for fallback
  const femaleKeywords = ['zira', 'female', 'woman', 'feminine']
  
  for (const keyword of femaleKeywords) {
    const voice = voices.find(v => v.name.toLowerCase().includes(keyword))
    if (voice) {
      console.log(`✅ Found female voice by keyword: ${voice.name}`)
      return voice
    }
  }

  return voices[0] || null
}

// Find AI/Robotic voice
const findAIVoice = (voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | null => {
  // Prefer Google voices for AI/robotic feel (user has many Google voices)
  const googleVoices = voices.filter(v => v.name.toLowerCase().includes('google'))
  
  // Try to find Google voice for the specific language
  const languageCode = language.split('-')[0]
  const googleLanguageVoice = googleVoices.find(v => v.lang.startsWith(languageCode))
  if (googleLanguageVoice) {
    console.log(`✅ Found Google AI voice for language: ${googleLanguageVoice.name}`)
    return googleLanguageVoice
  }

  // Fallback to any Google voice
  if (googleVoices.length > 0) {
    console.log(`✅ Found Google AI voice (fallback): ${googleVoices[0].name}`)
    return googleVoices[0]
  }

  // Last resort: use first available voice
  return voices[0] || null
}