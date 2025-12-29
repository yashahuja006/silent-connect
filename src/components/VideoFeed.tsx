import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { useHandTracking } from '../hooks/useHandTracking'
import CircularProgress from './CircularProgress'
import DemoMode from './DemoMode'
import MediaPipeDebug from './MediaPipeDebug'
import { translateGesture } from '../utils/translations'

interface VideoFeedProps {
  onGestureDetected: (gesture: string, confidence: number, landmarks?: any[]) => void
  currentGesture: string | null
  confidence: number
  language: string
  onDemoMode?: () => void
  onCheckLogs?: () => void
  onTestStatus?: () => void
  onTestCanvas?: () => void
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  onGestureDetected, 
  currentGesture, 
  confidence,
  language,
  onDemoMode,
  onCheckLogs,
  onTestStatus,
  onTestCanvas
}) => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showDemoMode, setShowDemoMode] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const { isLoaded, currentGesture: detectedGesture, confidence: detectedConfidence, landmarks, error } = useHandTracking(videoRef, canvasRef)

  // Pass gesture detection to parent with landmarks - FIXED: Only one detection path
  useEffect(() => {
    if (detectedGesture && detectedConfidence >= 0.7) {
      // Pass the raw gesture name (not translated) to App.tsx for proper speech synthesis
      onGestureDetected(detectedGesture, detectedConfidence, landmarks || undefined)
    }
  }, [detectedGesture, detectedConfidence, landmarks, onGestureDetected])

  useEffect(() => {
    // Set up video reference from webcam
    if (webcamRef.current?.video) {
      const video = webcamRef.current.video
      if (videoRef.current !== video) {
        // Create a new ref object if needed
        ;(videoRef as any).current = video
      }
    }
  }, [])

  useEffect(() => {
    // Show demo mode if MediaPipe fails to load after 8 seconds (reduced from 20)
    const demoTimeout = setTimeout(() => {
      if (!isLoaded && !showDemoMode) {
        console.log('VideoFeed: Switching to Demo Mode due to loading timeout')
        setShowDemoMode(true)
      }
    }, 8000) // Reduced timeout

    return () => clearTimeout(demoTimeout)
  }, [isLoaded, showDemoMode])

  // Expose debug functions to parent
  useEffect(() => {
    if (onDemoMode) {
      (window as any).triggerDemoMode = () => {
        console.log('🎭 User switched to Demo Mode')
        setShowDemoMode(true)
        onDemoMode()
      }
    }
  }, [onDemoMode])

  useEffect(() => {
    if (onCheckLogs) {
      (window as any).triggerCheckLogs = () => {
        setShowDebug(true)
        onCheckLogs()
      }
    }
  }, [onCheckLogs])

  useEffect(() => {
    if (onTestStatus) {
      (window as any).triggerTestStatus = () => {
        console.log('🧪 MANUAL TEST: MediaPipe Status Check')
        console.log('📹 Video ref:', videoRef.current)
        console.log('🎨 Canvas ref:', canvasRef.current)
        console.log('📷 Webcam ref:', webcamRef.current?.video)
        console.log('🤖 MediaPipe loaded:', isLoaded)
        console.log('❌ Error state:', error)
        
        if (webcamRef.current?.video) {
          const video = webcamRef.current.video
          console.log('📹 Video state:', {
            readyState: video.readyState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            paused: video.paused
          })
        }
        onTestStatus()
      }
    }
  }, [onTestStatus, isLoaded, error])

  useEffect(() => {
    if (onTestCanvas) {
      (window as any).triggerTestCanvas = () => {
        console.log('🎨 CANVAS TEST: Drawing test pattern')
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = '#00ff80'
            ctx.lineWidth = 5
            ctx.beginPath()
            ctx.arc(320, 240, 50, 0, 2 * Math.PI)
            ctx.stroke()
            console.log('✅ Canvas test circle drawn')
            
            // Clear after 2 seconds
            setTimeout(() => {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
            }, 2000)
          }
        }
        onTestCanvas()
      }
    }
  }, [onTestCanvas])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user'
  }

  // Show demo mode if MediaPipe fails to load or has timeout error
  if (showDemoMode || error?.includes('timeout')) {
    return <DemoMode onGestureDetected={onGestureDetected} />
  }

  // Get translated gesture for display - use detectedGesture from useHandTracking
  const displayGesture = detectedGesture ? translateGesture(detectedGesture, language) : null

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">Vision Engine</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLoaded ? 'bg-green-400' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-300">
            {isLoaded ? 'Active' : 'Loading...'}
          </span>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-900/80 rounded-lg overflow-hidden border border-slate-700/50 sci-fi-viewfinder">
        {/* Sci-Fi Corner Brackets */}
        <div className="bottom-left"></div>
        <div className="bottom-right"></div>
        
        {/* Webcam Video */}
        <Webcam
          ref={webcamRef}
          audio={false}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          mirrored={true}
          onUserMedia={() => console.log('Camera access granted')}
          onUserMediaError={(error) => console.error('Camera error:', error)}
        />

        {/* Canvas overlay for hand landmarks */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* Gesture Display Overlay */}
        {displayGesture && (
          <div className="absolute top-4 left-4 dark-glass-panel p-4 flex items-center space-x-4">
            <CircularProgress confidence={detectedConfidence * 100} size={60} />
            <div>
              <div className="neon-gradient-text font-bold text-lg">{displayGesture}</div>
              <div className="cyber-subtext text-sm">AI Recognition</div>
              <div className="text-xs cyber-subtext mt-1">
                Hold for 0.6 seconds to speak
              </div>
            </div>
          </div>
        )}

        {/* No Hands Detected Overlay - REMOVED to avoid irritation */}
        {/* Removed the "Show your hand to start" message as requested */}

        {/* Error Display */}
        {error && !showDemoMode && (
          <div className="absolute top-4 right-4 bg-red-900/80 backdrop-blur-md rounded-lg p-3 border border-red-500/30 max-w-xs">
            <div className="text-red-300 text-sm mb-2">{error}</div>
            <div className="space-y-2">
              <button
                onClick={() => setShowDemoMode(true)}
                className="block w-full text-cyan-400 hover:text-teal-400 text-xs underline"
              >
                Try Demo Mode Instead
              </button>
              <button
                onClick={() => setShowDebug(true)}
                className="block w-full text-yellow-400 hover:text-yellow-300 text-xs underline"
              >
                🔍 Debug MediaPipe
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay with Progress */}
        {!isLoaded && !error && !showDemoMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-cyan-400 mb-2">🎬 Loading MediaPipe...</div>
              <div className="text-sm text-gray-400 mb-4">
                Optimized for video recording (~5s)
              </div>
              <div className="text-xs text-gray-500 mb-6">
                ✨ Multiple CDN sources • Faster model • Better detection
              </div>
              
              {/* Prominent Demo Button */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowDemoMode(true)}
                  className="bg-cyan-600/50 hover:bg-cyan-500/50 border border-cyan-400/50 text-cyan-100 px-6 py-3 rounded-lg font-medium transition-all"
                >
                  🎭 Use Demo Mode Instead
                </button>
                <button
                  onClick={() => setShowDebug(true)}
                  className="bg-yellow-600/50 hover:bg-yellow-500/50 border border-yellow-400/50 text-yellow-100 px-6 py-3 rounded-lg font-medium transition-all"
                >
                  🔍 Debug MediaPipe Issues
                </button>
                <div className="text-xs text-gray-400">
                  Demo mode works instantly with button gestures
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Modal */}
      {showDebug && (
        <MediaPipeDebug onClose={() => setShowDebug(false)} />
      )}

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <div>
          {isLoaded ? 'High-performance mode active' : showDemoMode ? 'Demo mode active' : 'Initializing...'}
        </div>
        <div>
          {isLoaded ? 'Target: 60+ FPS | Latency: ~6ms' : 'Loading models...'}
        </div>
      </div>
    </div>
  )
}

export default VideoFeed