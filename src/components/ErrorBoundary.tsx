import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Silent-Connect Error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cyber-dark text-white flex items-center justify-center p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-cyber-cyan mb-4">
              Silent-Connect Error
            </h1>
            <div className="bg-cyber-gray border border-red-500/30 rounded-lg p-6 mb-6">
              <h2 className="text-xl text-red-400 mb-3">Something went wrong</h2>
              <p className="text-gray-300 mb-4">
                The application encountered an unexpected error. This might be due to:
              </p>
              <ul className="text-left text-gray-400 space-y-2 mb-4">
                <li>• Camera or microphone permissions not granted</li>
                <li>• Browser compatibility issues with MediaPipe or Web Speech API</li>
                <li>• Network connectivity problems loading MediaPipe models</li>
                <li>• Hardware acceleration not available</li>
              </ul>
              
              {this.state.error && (
                <details className="text-left mt-4">
                  <summary className="cursor-pointer text-cyber-cyan hover:text-cyber-teal">
                    Technical Details
                  </summary>
                  <pre className="mt-2 p-3 bg-cyber-darker rounded text-xs text-red-300 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="cyber-button mr-4"
              >
                Reload Application
              </button>
              
              <div className="text-sm text-gray-400">
                <p>For best results, use Chrome or Edge browser</p>
                <p>Ensure camera and microphone permissions are enabled</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary