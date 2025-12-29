import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useSound } from '../hooks/useSound'
import { GESTURE_TRANSLATIONS, translateGesture } from '../utils/translations'

interface PracticeModeProps {
  currentGesture: string | null
  confidence: number
  language: string
}

type GameMode = 'zen' | 'timeAttack'
type GameState = 'playing' | 'gameOver'

interface HighScore {
  score: number
  date: string
  mode: string
}

const PracticeMode: React.FC<PracticeModeProps> = ({ currentGesture, confidence, language }) => {
  const { playSuccess, playGameOver } = useSound()
  
  // Game State
  const [gameMode, setGameMode] = useState<GameMode>('zen')
  const [gameState, setGameState] = useState<GameState>('playing')
  const [isKidsMode, setIsKidsMode] = useState(false)
  
  // Game Logic
  const [targetGesture, setTargetGesture] = useState<string>('')
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Time Attack Mode
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameStarted, setGameStarted] = useState(false)
  
  // Leaderboard
  const [highScores, setHighScores] = useState<HighScore[]>([])

  // Get gestures for current language
  const getGesturesForLanguage = () => {
    return Object.keys(GESTURE_TRANSLATIONS)
  }

  // Get translated gesture name
  const getTranslatedGesture = (gesture: string) => {
    return translateGesture(gesture, language)
  }

  // Load high scores from localStorage
  const loadHighScores = useCallback(() => {
    try {
      const saved = localStorage.getItem('silent-connect-highscores')
      if (saved) {
        const scores = JSON.parse(saved) as HighScore[]
        setHighScores(scores.sort((a, b) => b.score - a.score).slice(0, 5))
      }
    } catch (error) {
      console.warn('Failed to load high scores:', error)
    }
  }, [])

  // Save high score to localStorage
  const saveHighScore = useCallback((newScore: number) => {
    try {
      const saved = localStorage.getItem('silent-connect-highscores')
      const existingScores = saved ? JSON.parse(saved) as HighScore[] : []
      
      const newHighScore: HighScore = {
        score: newScore,
        date: new Date().toLocaleDateString(),
        mode: gameMode
      }
      
      const updatedScores = [...existingScores, newHighScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Keep top 10
      
      localStorage.setItem('silent-connect-highscores', JSON.stringify(updatedScores))
      setHighScores(updatedScores.slice(0, 5)) // Show top 5
    } catch (error) {
      console.warn('Failed to save high score:', error)
    }
  }, [gameMode])

  // Pick a random gesture
  const pickRandomGesture = useCallback(() => {
    const availableGestures = getGesturesForLanguage()
    const randomGesture = availableGestures[Math.floor(Math.random() * availableGestures.length)]
    setTargetGesture(randomGesture)
    setIsCorrect(false)
    setShowSuccess(false)
  }, [])

  // Initialize game
  useEffect(() => {
    pickRandomGesture()
    loadHighScores()
  }, [pickRandomGesture, loadHighScores, language])

  // Time Attack Timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (gameMode === 'timeAttack' && gameStarted && gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (gameMode === 'timeAttack' && timeLeft === 0 && gameState === 'playing') {
      // Game Over
      setGameState('gameOver')
      setGameStarted(false)
      playGameOver()
      if (score > 0) {
        saveHighScore(score)
      }
    }
    
    return () => clearTimeout(timer)
  }, [gameMode, gameStarted, gameState, timeLeft, score, playGameOver, saveHighScore])

  // Gesture Detection Logic
  useEffect(() => {
    if (currentGesture && targetGesture && confidence >= 0.7 && gameState === 'playing') {
      if (currentGesture.toLowerCase() === targetGesture.toLowerCase() && !isCorrect) {
        setIsCorrect(true)
        setShowSuccess(true)
        setScore(prev => prev + 1)
        
        // Play success sound
        playSuccess()
        
        // Trigger confetti explosion (every time in Time Attack for high energy)
        confetti({
          particleCount: gameMode === 'timeAttack' ? 150 : 100,
          spread: gameMode === 'timeAttack' ? 90 : 70,
          origin: { y: 0.6 },
          colors: isKidsMode 
            ? ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
            : ['#00ffff', '#ffffff', '#00ff80']
        })

        // Pick new gesture after delay
        setTimeout(() => {
          pickRandomGesture()
        }, gameMode === 'timeAttack' ? 1000 : 2000) // Faster in Time Attack
      }
    }
  }, [currentGesture, targetGesture, confidence, isCorrect, playSuccess, pickRandomGesture, gameMode, gameState, isKidsMode])

  // Start Time Attack
  const startTimeAttack = () => {
    setGameMode('timeAttack')
    setGameState('playing')
    setGameStarted(true)
    setTimeLeft(30)
    setScore(0)
    pickRandomGesture()
  }

  // Reset to Zen Mode
  const resetToZen = () => {
    setGameMode('zen')
    setGameState('playing')
    setGameStarted(false)
    setTimeLeft(30)
    setScore(0)
    pickRandomGesture()
  }

  // Restart Time Attack
  const restartTimeAttack = () => {
    setGameState('playing')
    setGameStarted(true)
    setTimeLeft(30)
    setScore(0)
    pickRandomGesture()
  }

  // Get fun feedback messages for Kids Mode
  const getKidsFeedback = () => {
    const messages = ['🌟 Superstar!', '🚀 Amazing!', '🦁 Roar!', '🎉 Fantastic!', '⭐ Brilliant!', '🏆 Champion!']
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getGestureEmoji = (gesture: string) => {
    const emojiMap: { [key: string]: string } = {
      'Peace': '✌️',
      'Thumbs Up': '👍',
      'OK': '👌',
      'Open Palm': '✋',
      'Fist': '✊',
      'Point Up': '☝️',
      'Stop': '🛑',
      'Thank You': '🙏',
      'Yes': '🤘',
      'No': '👎',
      'Hello': '🤙',
      'Help': '🤟'
    }
    return emojiMap[gesture] || '👋'
  }

  // Dynamic styling based on Kids Mode
  const containerClass = isKidsMode 
    ? 'bg-gradient-to-r from-orange-300 to-pink-300 border-purple-400'
    : 'bg-slate-800/50 backdrop-blur-md border-cyan-500/30'
  
  const textClass = isKidsMode ? 'text-purple-900' : 'text-cyan-400'
  const secondaryTextClass = isKidsMode ? 'text-purple-700' : 'text-gray-300'

  return (
    <div className={`${containerClass} border rounded-lg p-6 h-full flex flex-col`}>
      {/* Header with Mode Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h2 className={`text-xl font-bold ${textClass}`}>
            {gameMode === 'zen' ? '🧘 Zen Practice' : '⚡ Time Attack'}
          </h2>
          
          {/* Kids Mode Toggle */}
          <button
            onClick={() => setIsKidsMode(!isKidsMode)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              isKidsMode 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
            }`}
          >
            🧸 Kids Mode
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Score */}
          <div className={`text-sm ${secondaryTextClass}`}>
            Score: <span className={`font-bold ${textClass}`}>{score}</span>
          </div>
          
          {/* Mode Switch Buttons */}
          {gameState === 'playing' && (
            <div className="flex space-x-2">
              {gameMode === 'zen' ? (
                <button
                  onClick={startTimeAttack}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold transition-all"
                >
                  ⚡ Time Attack
                </button>
              ) : (
                <button
                  onClick={resetToZen}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold transition-all"
                >
                  🧘 Zen Mode
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Time Attack Timer */}
      {gameMode === 'timeAttack' && gameState === 'playing' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${secondaryTextClass}`}>Time Remaining</span>
            <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : textClass}`}>
              {timeLeft}s
            </span>
          </div>
          <motion.div
            className="w-full bg-gray-700 rounded-full h-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={`h-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'} rounded-full`}
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      )}

      {/* Game Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <AnimatePresence mode="wait">
          {gameState === 'gameOver' ? (
            /* Game Over Screen */
            <motion.div
              key="gameOver"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center space-y-6"
            >
              <div className="text-6xl mb-4">🏁</div>
              <div className={`text-3xl font-bold ${textClass}`}>Game Over!</div>
              <div className={`text-xl ${secondaryTextClass}`}>
                Final Score: <span className={`font-bold ${textClass}`}>{score}</span>
              </div>
              
              {/* High Scores */}
              {highScores.length > 0 && (
                <div className={`bg-slate-900/50 rounded-lg p-4 ${isKidsMode ? 'bg-white/20' : ''}`}>
                  <div className={`text-lg font-bold ${textClass} mb-3`}>🏆 Top 5 High Scores</div>
                  <div className="space-y-1">
                    {highScores.map((highScore, index) => (
                      <div key={index} className={`flex justify-between text-sm ${secondaryTextClass}`}>
                        <span>#{index + 1}</span>
                        <span className="font-medium">{highScore.score} points</span>
                        <span className="text-xs opacity-75">{highScore.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  onClick={restartTimeAttack}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={resetToZen}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
                >
                  🧘 Zen Mode
                </button>
              </div>
            </motion.div>
          ) : showSuccess ? (
            /* Success Animation */
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <div className={`text-2xl font-bold ${isKidsMode ? 'text-purple-800' : 'text-green-400'} mb-2`}>
                {isKidsMode ? getKidsFeedback() : 'Perfect!'}
              </div>
              <div className={secondaryTextClass}>
                {gameMode === 'timeAttack' ? 'Keep going!' : 'Great job! Get ready for the next one...'}
              </div>
            </motion.div>
          ) : (
            /* Main Game Display */
            <motion.div
              key={targetGesture}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <div className={`text-lg ${secondaryTextClass} mb-4`}>Show me:</div>
              <div className="text-8xl mb-4">{getGestureEmoji(targetGesture)}</div>
              <div className={`text-3xl font-bold ${textClass} mb-6`}>
                {getTranslatedGesture(targetGesture)}
              </div>
              
              {/* Current Detection */}
              {currentGesture && (
                <div className={`${isKidsMode ? 'bg-white/30' : 'bg-slate-700/50'} rounded-lg p-4 border ${isKidsMode ? 'border-purple-300' : 'border-slate-600/30'}`}>
                  <div className={`text-sm ${secondaryTextClass} mb-2`}>Detected:</div>
                  <div className={`text-xl font-medium ${isKidsMode ? 'text-purple-800' : 'text-white'}`}>
                    {getTranslatedGesture(currentGesture)}
                  </div>
                  <div className={`text-sm ${secondaryTextClass} mt-1`}>
                    Confidence: {Math.round(confidence * 100)}%
                  </div>
                  {confidence < 0.7 && (
                    <div className={`text-xs ${isKidsMode ? 'text-orange-600' : 'text-yellow-400'} mt-2`}>
                      Hold gesture steady for better detection
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className={`mt-6 p-4 ${isKidsMode ? 'bg-white/20' : 'bg-slate-700/30'} rounded-lg border ${isKidsMode ? 'border-purple-300/30' : 'border-slate-600/20'}`}>
          <div className={`text-sm ${secondaryTextClass} text-center`}>
            <div className={`font-medium mb-2 ${textClass}`}>
              {gameMode === 'zen' ? 'Zen Practice Mode' : 'Time Attack Mode'}
            </div>
            <div className="text-xs space-y-1">
              {gameMode === 'zen' ? (
                <>
                  <div>• Practice gestures at your own pace</div>
                  <div>• No time pressure, just focus and learn</div>
                  <div>• Perfect for beginners and relaxed practice</div>
                </>
              ) : (
                <>
                  <div>• Get as many gestures right as possible in 30 seconds</div>
                  <div>• Fast-paced action for competitive practice</div>
                  <div>• Beat your high score and climb the leaderboard!</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Button (Zen Mode Only) */}
      {gameMode === 'zen' && gameState === 'playing' && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setScore(0)
              pickRandomGesture()
            }}
            className={`${isKidsMode ? 'bg-purple-500 hover:bg-purple-400 border-purple-400' : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/30 hover:border-cyan-500/50'} border text-gray-100 px-4 py-2 rounded-lg transition-all duration-300`}
          >
            🔄 Reset Practice
          </button>
        </div>
      )}
    </div>
  )
}

export default PracticeMode