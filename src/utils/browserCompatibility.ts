export interface CompatibilityCheck {
  isSupported: boolean
  feature: string
  message: string
}

export const checkBrowserCompatibility = (): CompatibilityCheck[] => {
  const checks: CompatibilityCheck[] = []

  // Check MediaDevices API (Camera access)
  checks.push({
    isSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    feature: 'Camera Access',
    message: 'Camera access is required for gesture recognition'
  })

  // Check Web Speech API - Speech Recognition
  checks.push({
    isSupported: !!((globalThis as any).webkitSpeechRecognition || (globalThis as any).SpeechRecognition),
    feature: 'Speech Recognition',
    message: 'Speech recognition enables voice-to-text functionality'
  })

  // Check Web Speech API - Speech Synthesis
  checks.push({
    isSupported: !!((globalThis as any).speechSynthesis),
    feature: 'Speech Synthesis',
    message: 'Speech synthesis enables text-to-speech for gestures'
  })

  // Check Canvas API (for drawing hand landmarks)
  checks.push({
    isSupported: !!document.createElement('canvas').getContext,
    feature: 'Canvas API',
    message: 'Canvas is required for drawing hand tracking overlays'
  })

  // Check WebAssembly (MediaPipe requirement)
  checks.push({
    isSupported: !!((globalThis as any).WebAssembly),
    feature: 'WebAssembly',
    message: 'WebAssembly is required for MediaPipe hand tracking'
  })

  // Check if running in secure context (HTTPS or localhost)
  checks.push({
    isSupported: (globalThis as any).isSecureContext,
    feature: 'Secure Context',
    message: 'HTTPS is required for camera and microphone access'
  })

  return checks
}

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  let browserName = 'Unknown'
  let isRecommended = false

  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserName = 'Chrome'
    isRecommended = true
  } else if (userAgent.includes('Edg')) {
    browserName = 'Edge'
    isRecommended = true
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox'
    isRecommended = false
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari'
    isRecommended = false
  }

  return {
    name: browserName,
    isRecommended,
    userAgent
  }
}

export const isOfflineCapable = (): boolean => {
  // Check if service worker is supported for offline functionality
  return 'serviceWorker' in navigator
}