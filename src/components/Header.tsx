import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-md border-b border-cyan-500/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-cyan-400">
            Silent-Connect
          </div>
          <div className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-sm font-medium border border-cyan-500/30">
            BETA
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300">Latency: ~12ms</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400">Active</span>
          </div>

          <div className="text-gray-400">
            Hackathon Demo
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header