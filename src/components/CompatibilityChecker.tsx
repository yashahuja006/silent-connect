import React, { useState, useEffect } from 'react'
import { checkBrowserCompatibility, getBrowserInfo, CompatibilityCheck } from '../utils/browserCompatibility'

interface CompatibilityCheckerProps {
  onCompatibilityChecked: (isCompatible: boolean) => void
}

const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ onCompatibilityChecked }) => {
  const [checks, setChecks] = useState<CompatibilityCheck[]>([])
  const [browserInfo, setBrowserInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const compatibility = checkBrowserCompatibility()
    const browser = getBrowserInfo()
    
    setChecks(compatibility)
    setBrowserInfo(browser)
    
    const isCompatible = compatibility.every(check => check.isSupported)
    onCompatibilityChecked(isCompatible)
  }, [onCompatibilityChecked])

  const allSupported = checks.every(check => check.isSupported)
  const criticalIssues = checks.filter(check => !check.isSupported && 
    (check.feature === 'Camera Access' || check.feature === 'Secure Context'))

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-cyber-dark/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-cyber-gray border border-cyber-cyan rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-2">
            Browser Compatibility Check
          </h2>
          <p className="text-gray-300">
            Verifying your browser supports Silent-Connect features
          </p>
        </div>

        {/* Browser Info */}
        <div className="mb-6 p-4 bg-cyber-darker rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400">Browser: </span>
              <span className="text-white font-medium">{browserInfo?.name}</span>
            </div>
            <div className={`px-3 py-1 rounded text-sm ${
              browserInfo?.isRecommended 
                ? 'bg-cyber-green/20 text-cyber-green' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {browserInfo?.isRecommended ? 'Recommended' : 'Limited Support'}
            </div>
          </div>
        </div>

        {/* Compatibility Checks */}
        <div className="space-y-3 mb-6">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-cyber-darker rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  check.isSupported ? 'bg-cyber-green' : 'bg-red-500'
                }`} />
                <div>
                  <div className="font-medium text-white">{check.feature}</div>
                  <div className="text-sm text-gray-400">{check.message}</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                check.isSupported ? 'text-cyber-green' : 'text-red-400'
              }`}>
                {check.isSupported ? 'Supported' : 'Not Available'}
              </div>
            </div>
          ))}
        </div>

        {/* Status and Actions */}
        <div className="text-center">
          {allSupported ? (
            <div>
              <div className="text-cyber-green text-lg font-medium mb-4">
                ✅ All features supported! Ready to use Silent-Connect.
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="cyber-button"
              >
                Continue to Application
              </button>
            </div>
          ) : criticalIssues.length > 0 ? (
            <div>
              <div className="text-red-400 text-lg font-medium mb-4">
                ❌ Critical features missing. Silent-Connect may not work properly.
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Please use Chrome or Edge browser and ensure you're on HTTPS.
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="cyber-button"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-yellow-400 text-lg font-medium mb-4">
                ⚠️ Some features may have limited support.
              </div>
              <div className="text-sm text-gray-400 mb-4">
                For the best experience, use Chrome or Edge browser.
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="cyber-button"
              >
                Continue to Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompatibilityChecker