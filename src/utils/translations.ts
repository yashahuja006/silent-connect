export interface Translation {
  [key: string]: {
    'en-US': string
    'es-ES': string
    'fr-FR': string
    'ja-JP': string
    'hi-IN': string
  }
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español (ES)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français (FR)', flag: '🇫🇷' },
  { code: 'ja-JP', name: '日本語 (JP)', flag: '🇯🇵' },
  { code: 'hi-IN', name: 'हिन्दी (IN)', flag: '🇮🇳' }
]

export const GESTURE_TRANSLATIONS: Translation = {
  'Hello': {
    'en-US': 'Hello',
    'es-ES': 'Hola',
    'fr-FR': 'Bonjour',
    'ja-JP': 'こんにちは',
    'hi-IN': 'नमस्ते'
  },
  'Peace': {
    'en-US': 'Peace',
    'es-ES': 'Paz',
    'fr-FR': 'Paix',
    'ja-JP': '平和',
    'hi-IN': 'शांति'
  },
  'Thumbs Up': {
    'en-US': 'Thumbs Up',
    'es-ES': 'Pulgar Arriba',
    'fr-FR': 'Pouce en Haut',
    'ja-JP': '親指を立てる',
    'hi-IN': 'अंगूठा ऊपर'
  },
  'OK': {
    'en-US': 'OK',
    'es-ES': 'Vale',
    'fr-FR': 'D\'accord',
    'ja-JP': 'オーケー',
    'hi-IN': 'ठीक है'
  },
  'Open Palm': {
    'en-US': 'Open Palm',
    'es-ES': 'Palma Abierta',
    'fr-FR': 'Paume Ouverte',
    'ja-JP': '開いた手のひら',
    'hi-IN': 'खुली हथेली'
  },
  'Fist': {
    'en-US': 'Fist',
    'es-ES': 'Puño',
    'fr-FR': 'Poing',
    'ja-JP': '拳',
    'hi-IN': 'मुट्ठी'
  },
  'Point Up': {
    'en-US': 'Point Up',
    'es-ES': 'Señalar Arriba',
    'fr-FR': 'Pointer Vers le Haut',
    'ja-JP': '上を指す',
    'hi-IN': 'ऊपर इशारा'
  },
  'Stop': {
    'en-US': 'Stop',
    'es-ES': 'Alto',
    'fr-FR': 'Arrêt',
    'ja-JP': '止まれ',
    'hi-IN': 'रुको'
  },
  'Thank You': {
    'en-US': 'Thank You',
    'es-ES': 'Gracias',
    'fr-FR': 'Merci',
    'ja-JP': 'ありがとう',
    'hi-IN': 'धन्यवाद'
  },
  'Yes': {
    'en-US': 'Yes',
    'es-ES': 'Sí',
    'fr-FR': 'Oui',
    'ja-JP': 'はい',
    'hi-IN': 'हाँ'
  },
  'No': {
    'en-US': 'No',
    'es-ES': 'No',
    'fr-FR': 'Non',
    'ja-JP': 'いいえ',
    'hi-IN': 'नहीं'
  },
  'Help': {
    'en-US': 'Help',
    'es-ES': 'Ayuda',
    'fr-FR': 'Aide',
    'ja-JP': '助けて',
    'hi-IN': 'मदद'
  }
}

export const translateGesture = (gesture: string, language: string): string => {
  const translation = GESTURE_TRANSLATIONS[gesture]
  if (!translation) {
    return gesture // Fallback to original gesture name
  }
  
  return translation[language as keyof typeof translation] || translation['en-US'] || gesture
}