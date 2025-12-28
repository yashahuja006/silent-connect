import { useEffect, useRef, useState, RefObject } from 'react'
import { HandTrackingResult } from '../types'
import { GestureLogic } from '../utils/GestureLogic'

export const useHandTracking = (
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
): HandTrackingResult => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentGesture, setCurrentGesture] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for MediaPipe instances
  const handsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const gestureLogic = useRef(new GestureLogic())
  
  // Performance optimization: Don't store landmarks in state
  const currentLandmarksRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // Gesture tracking
  const lastGestureRef = useRef<string | null>(null)
  const gestureHoldStart = useRef<number>(0)
  const lastTriggeredGesture = useRef<string | null>(null)
  
  // Timeout for fallback to DemoMode
  const initializationTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return

    // CRITICAL: 5-second timeout for DemoMode fallback (reduced from 10s)
    initializationTimeout.current = globalThis.setTimeout(() => {
      if (!isLoaded) {
        console.log('MediaPipe timeout - switching to DemoMode')
        setError('MediaPipe loading timeout - using demo mode')
      }
    }, 5000) // Reduced to 5 seconds for faster fallback

    const initializeHandTracking = async () => {
      try {
        console.log('🔄 Starting MediaPipe initialization...')
        
        // Step 1: Test if MediaPipe packages can be imported
        console.log('📦 Importing MediaPipe packages...')
        const [handsModule, cameraModule] = await Promise.all([
          import('@mediapipe/hands').catch(err => {
            console.error('❌ Failed to import @mediapipe/hands:', err)
            throw new Error('MediaPipe hands import failed')
          }),
          import('@mediapipe/camera_utils').catch(err => {
            console.error('❌ Failed to import @mediapipe/camera_utils:', err)
            throw new Error('MediaPipe camera_utils import failed')
          })
        ])
        
        console.log('✅ MediaPipe packages imported successfully')
        const { Hands } = handsModule
        const { Camera } = cameraModule

        // Step 2: Test CDN connectivity
        console.log('🌐 Testing CDN connectivity...')
        const testUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
        try {
          const response = await fetch(testUrl, { method: 'HEAD' })
          if (!response.ok) {
            throw new Error(`CDN test failed: ${response.status}`)
          }
          console.log('✅ CDN connectivity confirmed')
        } catch (cdnError) {
          console.warn('⚠️ CDN test failed, but continuing:', cdnError)
        }

        // Step 3: Initialize Hands with multiple CDN fallbacks
        console.log('🤖 Initializing MediaPipe Hands...')
        const hands = new Hands({
          locateFile: (file: string) => {
            // Try multiple CDN sources
            const cdnSources = [
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
              `https://unpkg.com/@mediapipe/hands/${file}`,
              `https://cdn.skypack.dev/@mediapipe/hands/${file}`
            ]
            
            console.log(`📁 Loading file: ${file} from primary CDN`)
            return cdnSources[0] // Use primary CDN
          }
        })

        // Step 4: Configure MediaPipe settings
        console.log('⚙️ Configuring MediaPipe settings...')
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0, // Fastest model
          minDetectionConfidence: 0.5, // Lowered for better detection
          minTrackingConfidence: 0.4,  // Lowered for better tracking
          selfieMode: true
        })

        hands.onResults(onResults)
        handsRef.current = hands
        console.log('✅ MediaPipe Hands configured')

        // Step 5: Initialize camera with error handling
        if (videoRef.current) {
          console.log('📹 Initializing camera...')
          
          // Check camera permissions first
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            stream.getTracks().forEach(track => track.stop()) // Stop test stream
            console.log('✅ Camera permissions granted')
          } catch (permError) {
            console.error('❌ Camera permission denied:', permError)
            throw new Error('Camera access denied')
          }

          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current && videoRef.current) {
                try {
                  await handsRef.current.send({ image: videoRef.current })
                } catch (err) {
                  console.warn('⚠️ Frame processing error:', err)
                }
              }
            },
            width: 640,
            height: 480
          })

          cameraRef.current = camera
          
          console.log('🚀 Starting camera...')
          await camera.start()
          
          // Clear timeout on success
          if (initializationTimeout.current) {
            clearTimeout(initializationTimeout.current)
          }
          
          setIsLoaded(true)
          setError(null)
          console.log('🎉 MediaPipe loaded successfully!')
        }
        
      } catch (err) {
        console.error('💥 MediaPipe initialization failed:', err)
        
        // Provide specific error messages
        let errorMessage = 'MediaPipe failed to load'
        if (err instanceof Error) {
          if (err.message.includes('import')) {
            errorMessage = 'MediaPipe packages failed to import - using demo mode'
          } else if (err.message.includes('Camera')) {
            errorMessage = 'Camera access denied - using demo mode'
          } else if (err.message.includes('CDN')) {
            errorMessage = 'MediaPipe CDN unavailable - using demo mode'
          } else {
            errorMessage = `MediaPipe error: ${err.message} - using demo mode`
          }
        }
        
        setError(errorMessage)
        
        if (initializationTimeout.current) {
          clearTimeout(initializationTimeout.current)
        }
      }
    }

    // PERFORMANCE OPTIMIZATION: Direct canvas drawing without state updates
    const onResults = (results: any) => {
      // Store landmarks in ref, not state (prevents re-renders)
      currentLandmarksRef.current = results.multiHandLandmarks?.[0] || null
      
      // Use requestAnimationFrame for smooth drawing
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        drawHandSkeleton()
        processGesture()
      })
    }

    const drawHandSkeleton = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const landmarks = currentLandmarksRef.current
      if (!landmarks) return

      // Convert to our format
      const convertedLandmarks = landmarks.map((landmark: any) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility || 1
      }))

      // Draw skeleton with glow effect
      ctx.strokeStyle = '#00ff80'
      ctx.lineWidth = 3
      ctx.shadowColor = '#00ff80'
      ctx.shadowBlur = 5

      // Hand connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
      ]

      connections.forEach(([start, end]) => {
        if (convertedLandmarks[start] && convertedLandmarks[end]) {
          ctx.beginPath()
          ctx.moveTo(
            convertedLandmarks[start].x * canvas.width,
            convertedLandmarks[start].y * canvas.height
          )
          ctx.lineTo(
            convertedLandmarks[end].x * canvas.width,
            convertedLandmarks[end].y * canvas.height
          )
          ctx.stroke()
        }
      })

      // Draw landmark points
      ctx.fillStyle = '#00ffff'
      ctx.shadowColor = '#00ffff'
      convertedLandmarks.forEach((landmark: any) => {
        ctx.beginPath()
        ctx.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          4,
          0,
          2 * Math.PI
        )
        ctx.fill()
      })
      
      ctx.shadowBlur = 0 // Reset shadow
    }

    const processGesture = () => {
      const landmarks = currentLandmarksRef.current
      if (!landmarks) {
        // No hands detected - only update state if gesture changed
        if (lastGestureRef.current !== null) {
          setCurrentGesture(null)
          setConfidence(0)
          lastGestureRef.current = null
          gestureHoldStart.current = 0
          lastTriggeredGesture.current = null
        }
        return
      }

      // Convert landmarks
      const convertedLandmarks = landmarks.map((landmark: any) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility || 1
      }))

      // Detect gesture
      const gestureResult = gestureLogic.current.detectGesture(convertedLandmarks)
      
      if (gestureResult.gesture && gestureResult.confidence >= 0.65) {
        const now = Date.now()
        
        // Only update state if gesture CHANGED (prevents infinite loops)
        if (gestureResult.gesture !== lastGestureRef.current) {
          setCurrentGesture(gestureResult.gesture)
          setConfidence(gestureResult.confidence)
          lastGestureRef.current = gestureResult.gesture
          gestureHoldStart.current = now
          lastTriggeredGesture.current = null
        }
        
        // Check hold duration for speech trigger (1 second)
        if (now - gestureHoldStart.current >= 1000 && 
            lastTriggeredGesture.current !== gestureResult.gesture) {
          triggerSpeechSynthesis(gestureResult.gesture)
          lastTriggeredGesture.current = gestureResult.gesture
        }
      } else if (lastGestureRef.current !== null) {
        // Low confidence - only update if gesture changed
        setCurrentGesture(null)
        setConfidence(0)
        lastGestureRef.current = null
        gestureHoldStart.current = 0
      }
    }

    const triggerSpeechSynthesis = (gesture: string) => {
      if ('speechSynthesis' in globalThis) {
        globalThis.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(gesture)
        utterance.rate = 1.1
        utterance.pitch = 1
        utterance.volume = 1
        
        setTimeout(() => {
          globalThis.speechSynthesis.speak(utterance)
        }, 100)
      }
    }

    initializeHandTracking()

    return () => {
      // Cleanup
      if (initializationTimeout.current) {
        clearTimeout(initializationTimeout.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
      if (handsRef.current) {
        handsRef.current.close()
      }
    }
  }, [videoRef, canvasRef])

  return {
    isLoaded,
    currentGesture,
    confidence,
    landmarks: null, // No longer exposing landmarks to prevent re-renders
    error
  }
}