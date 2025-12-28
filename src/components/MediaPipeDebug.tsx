import React, { useState, useEffect } from 'react'

interface MediaPipeDebugProps {
  onClose: () => void
}

const MediaPipeDebug: React.FC<MediaPipeDebugProps> = ({ onClose }) => {
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    setDebugInfo([])
    
    addLog('🔍 Starting MediaPipe diagnostics...')
    
    // Check 1: Browser compatibility
    addLog(`🌐 Browser: ${navigator.userAgent}`)
    addLog(`📱 Platform: ${navigator.platform}`)
    addLog(`🔒 HTTPS: ${location.protocol === 'https:' ? 'Yes' : 'No'}`)
    
    // Check 2: Camera permissions
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName })
      addLog(`📹 Camera permission: ${permissions.state}`)
    } catch (err) {
      addLog(`❌ Camera permission check failed: ${err}`)
    }
    
    // Check 3: MediaDevices support
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      addLog('✅ MediaDevices API supported')
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(d => d.kind === 'videoinput')
        addLog(`📹 Cameras found: ${cameras.length}`)
      } catch (err) {
        addLog(`❌ Camera enumeration failed: ${err}`)
      }
    } else {
      addLog('❌ MediaDevices API not supported')
    }
    
    // Check 4: MediaPipe package imports
    try {
      addLog('📦 Testing MediaPipe imports...')
      const handsModule = await import('@mediapipe/hands')
      addLog('✅ @mediapipe/hands imported successfully')
      
      const cameraModule = await import('@mediapipe/camera_utils')
      addLog('✅ @mediapipe/camera_utils imported successfully')
      
      // Check if classes exist
      if (handsModule.Hands) {
        addLog('✅ Hands class available')
      } else {
        addLog('❌ Hands class not found')
      }
      
      if (cameraModule.Camera) {
        addLog('✅ Camera class available')
      } else {
        addLog('❌ Camera class not found')
      }
      
    } catch (err) {
      addLog(`❌ MediaPipe import failed: ${err}`)
    }
    
    // Check 5: CDN connectivity
    const cdnUrls = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
      'https://unpkg.com/@mediapipe/hands/hands.js',
      'https://cdn.skypack.dev/@mediapipe/hands/hands.js'
    ]
    
    for (const url of cdnUrls) {
      try {
        addLog(`🌐 Testing CDN: ${url}`)
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
          addLog(`✅ CDN accessible: ${response.status}`)
        } else {
          addLog(`❌ CDN failed: ${response.status}`)
        }
      } catch (err) {
        addLog(`❌ CDN error: ${err}`)
      }
    }
    
    // Check 6: WebAssembly support
    if (typeof WebAssembly === 'object') {
      addLog('✅ WebAssembly supported')
    } else {
      addLog('❌ WebAssembly not supported')
    }
    
    addLog('🏁 Diagnostics complete')
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400">MediaPipe Diagnostics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
          {debugInfo.map((log, index) => (
            <div key={index} className="mb-1 text-gray-300">
              {log}
            </div>
          ))}
          {isRunning && (
            <div className="text-cyan-400 animate-pulse">Running diagnostics...</div>
          )}
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-cyan-600/50 hover:bg-cyan-500/50 border border-cyan-400/50 text-cyan-100 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Again'}
          </button>
          <button
            onClick={() => {
              const text = debugInfo.join('\n')
              navigator.clipboard.writeText(text)
            }}
            className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 text-gray-100 px-4 py-2 rounded-lg"
          >
            Copy Logs
          </button>
        </div>
      </div>
    </div>
  )
}

export default MediaPipeDebug