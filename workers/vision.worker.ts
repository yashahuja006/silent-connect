/// <reference lib="webworker" />

import { 
  HandLandmarker, 
  FilesetResolver,
  DrawingUtils
} from '@mediapipe/tasks-vision'

// Worker message types
interface WorkerMessage {
  type: 'init' | 'process' | 'destroy'
  data?: any
}

interface InitMessage extends WorkerMessage {
  type: 'init'
  data: {
    modelPath: string
    options?: {
      runningMode?: 'IMAGE' | 'VIDEO'
      numHands?: number
      minHandDetectionConfidence?: number
      minHandPresenceConfidence?: number
      minTrackingConfidence?: number
    }
  }
}

interface ProcessMessage extends WorkerMessage {
  type: 'process'
  data: {
    imageData: ImageData
    timestamp: number
  }
}

interface WorkerResponse {
  type: 'initialized' | 'result' | 'error'
  data?: any
  error?: string
}

// Global variables
let handLandmarker: HandLandmarker | null = null
let isInitialized = false

// Initialize MediaPipe Hand Landmarker
async function initializeHandLandmarker(modelPath: string, options: any = {}) {
  try {
    console.log('🔧 Initializing MediaPipe Hand Landmarker in worker...')
    
    // Create file set resolver
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    )
    
    // Create hand landmarker with optimized settings
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: modelPath,
        delegate: 'GPU' // Use GPU acceleration when available
      },
      runningMode: options.runningMode || 'VIDEO',
      numHands: options.numHands || 2,
      minHandDetectionConfidence: options.minHandDetectionConfidence || 0.7,
      minHandPresenceConfidence: options.minHandPresenceConfidence || 0.5,
      minTrackingConfidence: options.minTrackingConfidence || 0.5
    })
    
    isInitialized = true
    console.log('✅ MediaPipe Hand Landmarker initialized successfully in worker')
    
    // Send success message back to main thread
    postMessage({
      type: 'initialized',
      data: { success: true }
    } as WorkerResponse)
    
  } catch (error) {
    console.error('❌ Failed to initialize MediaPipe Hand Landmarker:', error)
    
    postMessage({
      type: 'error',
      error: `Failed to initialize MediaPipe: ${error}`
    } as WorkerResponse)
  }
}

// Process image data for hand detection
async function processImageData(imageData: ImageData, timestamp: number) {
  if (!handLandmarker || !isInitialized) {
    postMessage({
      type: 'error',
      error: 'Hand landmarker not initialized'
    } as WorkerResponse)
    return
  }
  
  try {
    // Create canvas from image data
    const canvas = new OffscreenCanvas(imageData.width, imageData.height)
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }
    
    // Put image data on canvas
    ctx.putImageData(imageData, 0, 0)
    
    // Detect hands
    const results = handLandmarker.detectForVideo(canvas, timestamp)
    
    // Process results
    const processedResults = {
      landmarks: results.landmarks,
      worldLandmarks: results.worldLandmarks,
      handednesses: results.handednesses,
      timestamp,
      detectionTime: performance.now() - timestamp
    }
    
    // Send results back to main thread
    postMessage({
      type: 'result',
      data: processedResults
    } as WorkerResponse)
    
  } catch (error) {
    console.error('❌ Error processing image data:', error)
    
    postMessage({
      type: 'error',
      error: `Processing error: ${error}`
    } as WorkerResponse)
  }
}

// Cleanup resources
function cleanup() {
  if (handLandmarker) {
    handLandmarker.close()
    handLandmarker = null
  }
  isInitialized = false
  console.log('🧹 MediaPipe resources cleaned up')
}

// Handle messages from main thread
self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'init':
      const initData = data as InitMessage['data']
      await initializeHandLandmarker(initData.modelPath, initData.options)
      break
      
    case 'process':
      const processData = data as ProcessMessage['data']
      await processImageData(processData.imageData, processData.timestamp)
      break
      
    case 'destroy':
      cleanup()
      break
      
    default:
      console.warn('Unknown message type:', type)
  }
})

// Handle worker errors
self.addEventListener('error', (error) => {
  console.error('Worker error:', error)
  postMessage({
    type: 'error',
    error: `Worker error: ${error.message}`
  } as WorkerResponse)
})

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in worker:', event.reason)
  postMessage({
    type: 'error',
    error: `Unhandled promise rejection: ${event.reason}`
  } as WorkerResponse)
})

// Export types for main thread
export type {
  WorkerMessage,
  InitMessage,
  ProcessMessage,
  WorkerResponse
}