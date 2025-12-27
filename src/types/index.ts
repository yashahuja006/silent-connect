export interface Message {
  id: string
  type: 'gesture' | 'speech'
  content: string
  timestamp: Date
  confidence?: number
  sender: 'user' | 'system'
}

export interface GestureResult {
  gesture: string
  confidence: number
  landmarks: HandLandmark[]
  timestamp: Date
}

export interface HandLandmark {
  x: number
  y: number
  z: number
  visibility?: number
}

export interface AppState {
  isVideoActive: boolean
  isListening: boolean
  currentGesture: string | null
  confidence: number
  messages: Message[]
  error: string | null
}

export interface HandTrackingResult {
  isLoaded: boolean
  currentGesture: string | null
  confidence: number
  landmarks: HandLandmark[] | null
  error: string | null
}

export interface SpeechRecognitionResult {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  error: string | null
}

export interface SpeechSynthesisResult {
  speak: (text: string) => void
  isSpeaking: boolean
  cancel: () => void
  error: string | null
}