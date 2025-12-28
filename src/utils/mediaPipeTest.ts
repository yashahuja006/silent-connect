// MediaPipe compatibility and diagnostic utilities

export interface MediaPipeTestResult {
  success: boolean
  error?: string
  details: {
    browserSupported: boolean
    httpsRequired: boolean
    cameraAvailable: boolean
    webAssemblySupported: boolean
    importsWorking: boolean
    cdnAccessible: boolean
  }
}

export async function testMediaPipeCompatibility(): Promise<MediaPipeTestResult> {
  const result: MediaPipeTestResult = {
    success: false,
    details: {
      browserSupported: false,
      httpsRequired: false,
      cameraAvailable: false,
      webAssemblySupported: false,
      importsWorking: false,
      cdnAccessible: false
    }
  }

  try {
    // Test 1: Browser compatibility
    const userAgent = navigator.userAgent.toLowerCase()
    const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg')
    const isEdge = userAgent.includes('edg')
    const isFirefox = userAgent.includes('firefox')
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome')
    
    result.details.browserSupported = isChrome || isEdge || isFirefox
    
    // Test 2: HTTPS requirement
    result.details.httpsRequired = location.protocol === 'https:' || location.hostname === 'localhost'
    
    // Test 3: WebAssembly support
    result.details.webAssemblySupported = typeof WebAssembly === 'object'
    
    // Test 4: Camera availability
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(d => d.kind === 'videoinput')
        result.details.cameraAvailable = cameras.length > 0
      } catch (err) {
        result.details.cameraAvailable = false
      }
    }
    
    // Test 5: MediaPipe imports
    try {
      const [handsModule, cameraModule] = await Promise.all([
        import('@mediapipe/hands'),
        import('@mediapipe/camera_utils')
      ])
      
      result.details.importsWorking = !!(handsModule.Hands && cameraModule.Camera)
    } catch (err) {
      result.details.importsWorking = false
      result.error = `Import failed: ${err}`
    }
    
    // Test 6: CDN accessibility
    try {
      const response = await fetch('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', { 
        method: 'HEAD',
        mode: 'no-cors' // Avoid CORS issues
      })
      result.details.cdnAccessible = true
    } catch (err) {
      result.details.cdnAccessible = false
    }
    
    // Overall success check
    const allTestsPassed = Object.values(result.details).every(test => test === true)
    result.success = allTestsPassed
    
    if (!result.success && !result.error) {
      const failedTests = Object.entries(result.details)
        .filter(([_, passed]) => !passed)
        .map(([test, _]) => test)
      
      result.error = `Failed tests: ${failedTests.join(', ')}`
    }
    
  } catch (err) {
    result.error = `Test suite failed: ${err}`
  }
  
  return result
}

export function getMediaPipeRecommendations(testResult: MediaPipeTestResult): string[] {
  const recommendations: string[] = []
  
  if (!testResult.details.browserSupported) {
    recommendations.push('Use Chrome, Edge, or Firefox for best MediaPipe support')
  }
  
  if (!testResult.details.httpsRequired) {
    recommendations.push('MediaPipe requires HTTPS or localhost for camera access')
  }
  
  if (!testResult.details.webAssemblySupported) {
    recommendations.push('Your browser does not support WebAssembly (required for MediaPipe)')
  }
  
  if (!testResult.details.cameraAvailable) {
    recommendations.push('No camera detected or camera permissions denied')
  }
  
  if (!testResult.details.importsWorking) {
    recommendations.push('MediaPipe packages failed to import - check network connection')
  }
  
  if (!testResult.details.cdnAccessible) {
    recommendations.push('MediaPipe CDN is not accessible - check firewall/network settings')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All tests passed - MediaPipe should work. Try refreshing the page.')
  }
  
  return recommendations
}