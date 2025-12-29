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
    'en-US': 'Hello and Greetings',
    'es-ES': 'Hola y Saludos',
    'fr-FR': 'Bonjour et Salutations',
    'ja-JP': 'こんにちは と 挨拶',
    'hi-IN': 'नमस्ते और अभिवादन'
  },
  'Peace': {
    'en-US': 'Peace and Victory',
    'es-ES': 'Paz y Victoria',
    'fr-FR': 'Paix et Victoire',
    'ja-JP': '平和 と 勝利',
    'hi-IN': 'शांति और विजय'
  },
  'Thumbs Up': {
    'en-US': 'Good, Approve, Yes',
    'es-ES': 'Bueno, Aprobar, Sí',
    'fr-FR': 'Bien, Approuver, Oui',
    'ja-JP': '良い, 承認, はい',
    'hi-IN': 'अच्छा, स्वीकार, हाँ'
  },
  'OK': {
    'en-US': 'Perfect, Okay, Fine',
    'es-ES': 'Perfecto, Vale, Bien',
    'fr-FR': 'Parfait, D\'accord, Bien',
    'ja-JP': '完璧, オーケー, 良い',
    'hi-IN': 'बढ़िया, ठीक है, अच्छा'
  },
  'Open Palm': {
    'en-US': 'Wait, Stop, Listen',
    'es-ES': 'Espera, Alto, Escucha',
    'fr-FR': 'Attendre, Arrêt, Écouter',
    'ja-JP': '待って, 止まれ, 聞いて',
    'hi-IN': 'रुको, रोको, सुनो'
  },
  'Fist': {
    'en-US': 'Strong, Power, Solidarity',
    'es-ES': 'Fuerte, Poder, Solidaridad',
    'fr-FR': 'Fort, Pouvoir, Solidarité',
    'ja-JP': '強い, 力, 団結',
    'hi-IN': 'मजबूत, शक्ति, एकजुटता'
  },
  'Point Up': {
    'en-US': 'Attention, Look, Important',
    'es-ES': 'Atención, Mira, Importante',
    'fr-FR': 'Attention, Regarder, Important',
    'ja-JP': '注意, 見て, 重要',
    'hi-IN': 'ध्यान, देखो, महत्वपूर्ण'
  },
  'Stop': {
    'en-US': 'Stop, Enough, No More',
    'es-ES': 'Alto, Suficiente, No Más',
    'fr-FR': 'Arrêt, Assez, Plus',
    'ja-JP': '止まれ, 十分, もう結構',
    'hi-IN': 'रुको, बस, और नहीं'
  },
  'Thank You': {
    'en-US': 'Thank You, Grateful, Appreciate',
    'es-ES': 'Gracias, Agradecido, Apreciar',
    'fr-FR': 'Merci, Reconnaissant, Apprécier',
    'ja-JP': 'ありがとう, 感謝, 感謝する',
    'hi-IN': 'धन्यवाद, आभारी, सराहना'
  },
  'Yes': {
    'en-US': 'Rock On, Cool, Awesome',
    'es-ES': 'Genial, Guay, Increíble',
    'fr-FR': 'Super, Cool, Génial',
    'ja-JP': 'ロック, かっこいい, 素晴らしい',
    'hi-IN': 'बहुत बढ़िया, कूल, शानदार'
  },
  'No': {
    'en-US': 'Bad, Disapprove, Dislike',
    'es-ES': 'Malo, Desaprobar, No Me Gusta',
    'fr-FR': 'Mauvais, Désapprouver, Je N\'aime Pas',
    'ja-JP': '悪い, 不承認, 嫌い',
    'hi-IN': 'बुरा, अस्वीकार, नापसंद'
  },
  'Help': {
    'en-US': 'I Love You, Care, Support',
    'es-ES': 'Te Amo, Cuidar, Apoyo',
    'fr-FR': 'Je T\'aime, Soin, Soutien',
    'ja-JP': '愛してる, 気遣い, 支援',
    'hi-IN': 'मैं तुमसे प्यार करता हूँ, देखभाल, सहारा'
  }
}

export const translateGesture = (gesture: string, language: string): string => {
  const translation = GESTURE_TRANSLATIONS[gesture]
  if (!translation) {
    return gesture // Fallback to original gesture name
  }
  
  return translation[language as keyof typeof translation] || translation['en-US'] || gesture
}