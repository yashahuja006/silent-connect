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
  const gestureLogic = useRef(new GestureLogic())
  
  // Performance optimization: Don't store landmarks in state
  const currentLandmarksRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const frameCountRef = useRef<number>(0) // For high-FPS optimizations
  
  // Particle trails for Index Finger Tip (landmark 8) and Wrist (landmark 0)
  const indexFingerHistory = useRef<Array<{x: number, y: number, timestamp: number}>>([])
  const wristHistory = useRef<Array<{x: number, y: number, timestamp: number}>>([])
  const maxHistoryLength = 8
  
  // Gesture tracking
  const lastGestureRef = useRef<string | null>(null)
  
  // Timeout for fallback to DemoMode
  const initializationTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return

    // CRITICAL: 5-second timeout for DemoMode fallback
    initializationTimeout.current = globalThis.setTimeout(() => {
      if (!isLoaded) {
        console.log('MediaPipe timeout - switching to DemoMode')
        setError('MediaPipe loading timeout - using demo mode')
      }
    }, 5000)

    const initializeHandTracking = async () => {
      try {
        console.log('🔄 Starting MediaPipe initialization...')
        
        // Step 1: Safe Import Strategy
        console.log('📦 Importing MediaPipe with Safe Import Strategy...')
        
        const loadMediaPipe = async () => {
          const mpHands = await import('@mediapipe/hands');
          
          let Hands = mpHands.Hands || (mpHands as any).default?.Hands || (window as any).Hands;
          
          if (!Hands && (mpHands as any).default) {
            const defaultExport = (mpHands as any).default;
            Hands = defaultExport.Hands || defaultExport;
          }
          
          if (!Hands) {
            throw new Error("MediaPipe Hands class not found in bundle. Switching to Demo Mode.");
          }
          
          return { Hands };
        };
        
        const { Hands } = await loadMediaPipe();
        
        console.log('✅ MediaPipe Hands class imported:', { 
          HandsType: typeof Hands, 
          HandsConstructor: Hands?.constructor?.name
        })
        
        if (typeof Hands !== 'function') {
          console.error('❌ Hands is not a constructor function:', typeof Hands, Hands)
          throw new Error('Hands class is not a constructor')
        }

        // Step 2: Quick CDN connectivity test
        console.log('🌐 Testing CDN connectivity...')
        const testUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 2000)
          
          const response = await fetch(testUrl, { 
            method: 'HEAD',
            signal: controller.signal
          })
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            throw new Error(`CDN test failed: ${response.status}`)
          }
          console.log('✅ CDN connectivity confirmed')
        } catch (cdnError) {
          console.warn('⚠️ CDN test failed, but continuing:', cdnError)
        }

        // Step 3: Initialize Hands
        console.log('🤖 Initializing MediaPipe Hands...')
        const hands = new Hands({
          locateFile: (file: string) => {
            const cdnSources = [
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
              `https://unpkg.com/@mediapipe/hands/${file}`,
              `https://cdn.skypack.dev/@mediapipe/hands/${file}`
            ]
            
            console.log(`📁 Loading file: ${file} from primary CDN`)
            return cdnSources[0]
          }
        })

        // Step 4: Configure MediaPipe for HIGH PERFORMANCE (60-90 FPS)
        console.log('⚙️ Configuring MediaPipe for high-performance mode...')
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0, // Fastest model for maximum FPS
          minDetectionConfidence: 0.6, // Slightly lower for speed
          minTrackingConfidence: 0.4,  // Lower for smoother high-FPS tracking
          selfieMode: true
        })

        hands.onResults(onResults)
        handsRef.current = hands
        console.log('✅ MediaPipe Hands configured')

        // Step 5: Set up video processing
        if (videoRef.current) {
          console.log('📹 Setting up video processing...')
          
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            stream.getTracks().forEach(track => track.stop())
            console.log('✅ Camera permissions granted')
          } catch (permError) {
            console.error('❌ Camera permission denied:', permError)
            throw new Error('Camera access denied')
          }

          // Set up high-performance frame processing loop (60-90 FPS capable)
          let frameCount = 0
          let lastFrameTime = performance.now()
          
          const processFrame = async () => {
            if (handsRef.current && videoRef.current && videoRef.current.readyState >= 2) {
              try {
                // Process every frame for maximum smoothness (no throttling)
                await handsRef.current.send({ image: videoRef.current })
                frameCount++
                
                // Log FPS every 60 frames for monitoring
                if (frameCount % 60 === 0) {
                  const now = performance.now()
                  const fps = Math.round(60000 / (now - lastFrameTime))
                  console.log(`🚀 MediaPipe FPS: ${fps}`)
                  lastFrameTime = now
                }
              } catch (err) {
                console.warn('⚠️ Frame processing error:', err)
              }
            }
            // Continue processing at maximum browser refresh rate (60-120 FPS)
            requestAnimationFrame(processFrame)
          }
          
          if (videoRef.current.readyState >= 2) {
            processFrame()
          } else {
            videoRef.current.addEventListener('loadeddata', processFrame, { once: true })
          }
          
          if (initializationTimeout.current) {
            clearTimeout(initializationTimeout.current)
          }
          
          setIsLoaded(true)
          setError(null)
          console.log('🎉 MediaPipe loaded successfully!')
        }
        
      } catch (err) {
        console.error('💥 MediaPipe initialization failed:', err)
        
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
      currentLandmarksRef.current = results.multiHandLandmarks?.[0] || null
      
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

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const landmarks = currentLandmarksRef.current
      if (!landmarks) return

      const convertedLandmarks = landmarks.map((landmark: any) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility || 1
      }))

      // Update particle trails (optimized for high FPS)
      const now = Date.now()
      frameCountRef.current++
      
      // Reduce particle trail frequency for 60+ FPS performance
      if (frameCountRef.current % 2 === 0) { // Only update every 2nd frame for particles
        if (convertedLandmarks[8]) {
          indexFingerHistory.current.push({
            x: convertedLandmarks[8].x * canvas.width,
            y: convertedLandmarks[8].y * canvas.height,
            timestamp: now
          })
          if (indexFingerHistory.current.length > 6) { // Reduced from 8 for performance
            indexFingerHistory.current.shift()
          }
        }
        
        if (convertedLandmarks[0]) {
          wristHistory.current.push({
            x: convertedLandmarks[0].x * canvas.width,
            y: convertedLandmarks[0].y * canvas.height,
            timestamp: now
          })
          if (wristHistory.current.length > 6) { // Reduced from 8 for performance
            wristHistory.current.shift()
          }
        }
      }

      // Draw particle trails
      drawParticleTrails(ctx, indexFingerHistory.current, '#00ffff', 'Index Finger')
      drawParticleTrails(ctx, wristHistory.current, '#ff00ff', 'Wrist')

      // Draw skeleton with NEON CYAN glow
      ctx.strokeStyle = '#00ffff'
      ctx.lineWidth = 3
      ctx.shadowColor = '#00ffff'
      ctx.shadowBlur = 15

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
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#00ffff'
      ctx.shadowBlur = 15
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
      
      ctx.shadowBlur = 0
    }

    const drawParticleTrails = (ctx: CanvasRenderingContext2D, history: Array<{x: number, y: number, timestamp: number}>, color: string, label: string) => {
      if (history.length < 2) return

      const now = Date.now()
      
      for (let i = 1; i < history.length; i++) {
        const current = history[i]
        const previous = history[i - 1]
        
        const age = now - current.timestamp
        const maxAge = 2000
        const opacity = Math.max(0, 1 - (age / maxAge))
        
        if (opacity > 0) {
          ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0')
          ctx.lineWidth = 2 + (opacity * 3)
          ctx.shadowColor = color
          ctx.shadowBlur = 8 * opacity
          
          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.lineTo(current.x, current.y)
          ctx.stroke()
        }
      }
      
      history.forEach((pos) => {
        const age = now - pos.timestamp
        const maxAge = 2000
        const opacity = Math.max(0, 1 - (age / maxAge))
        
        if (opacity > 0) {
          const size = 2 + (opacity * 4)
          ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0')
          ctx.shadowColor = color
          ctx.shadowBlur = 6 * opacity
          
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI)
          ctx.fill()
        }
      })
      
      ctx.shadowBlur = 0
    }

    const processGesture = () => {
      const landmarks = currentLandmarksRef.current
      if (!landmarks) {
        if (lastGestureRef.current !== null) {
          setCurrentGesture(null)
          setConfidence(0)
          lastGestureRef.current = null
        }
        return
      }

      const convertedLandmarks = landmarks.map((landmark: any) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility || 1
      }))

      const gestureResult = gestureLogic.current.detectGesture(convertedLandmarks)
      
      if (gestureResult.gesture && gestureResult.confidence >= 0.45) { // Lowered for high-FPS responsiveness
        if (gestureResult.gesture !== lastGestureRef.current || 
            Math.abs(gestureResult.confidence - confidence) > 0.03) { // More sensitive for 60+ FPS
          setCurrentGesture(gestureResult.gesture)
          setConfidence(gestureResult.confidence)
          lastGestureRef.current = gestureResult.gesture
        }
      } else if (lastGestureRef.current !== null) {
        setCurrentGesture(null)
        setConfidence(0)
        lastGestureRef.current = null
      }
    }

    initializeHandTracking()

    return () => {
      if (initializationTimeout.current) {
        clearTimeout(initializationTimeout.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
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
    landmarks: currentLandmarksRef.current,
    error
  }
}