export default function AITrainerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">AI Trainer</h1>
      <p className="text-gray-400">Personalized AI-powered gesture training</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Training Session</h3>
          <div className="bg-black h-64 rounded flex items-center justify-center mb-4">
            <p className="text-gray-400">AI Training Interface</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Start Training
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Pause
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Stop
            </button>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">AI Feedback</h3>
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-600 p-3 rounded">
              <h4 className="text-green-400 font-semibold">Excellent Form!</h4>
              <p className="text-gray-300 text-sm">Your hand positioning is perfect for the "Hello" gesture.</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-600 p-3 rounded">
              <h4 className="text-blue-400 font-semibold">Tip</h4>
              <p className="text-gray-300 text-sm">Try to keep your fingers more spread for better detection.</p>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded">
              <h4 className="text-yellow-400 font-semibold">Practice Suggestion</h4>
              <p className="text-gray-300 text-sm">Focus on the "Thank You" gesture next - it's similar to what you just learned.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Training Programs</h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-700 rounded">
              <h4 className="text-white font-semibold">Beginner Course</h4>
              <p className="text-gray-400 text-sm">Basic gestures and fundamentals</p>
              <div className="mt-2">
                <div className="bg-gray-600 h-2 rounded">
                  <div className="bg-green-600 h-2 rounded w-3/4"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">75% Complete</p>
              </div>
            </div>
            <div className="p-3 bg-slate-700 rounded">
              <h4 className="text-white font-semibold">Intermediate</h4>
              <p className="text-gray-400 text-sm">Complex gestures and combinations</p>
              <div className="mt-2">
                <div className="bg-gray-600 h-2 rounded">
                  <div className="bg-blue-600 h-2 rounded w-1/3"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">33% Complete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Performance Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Accuracy Rate</span>
              <span className="text-green-400 font-bold">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Speed (gestures/min)</span>
              <span className="text-blue-400 font-bold">18.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Consistency Score</span>
              <span className="text-purple-400 font-bold">8.7/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Sessions</span>
              <span className="text-yellow-400 font-bold">47</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">🏆</div>
              <div>
                <h4 className="text-white font-semibold text-sm">First Steps</h4>
                <p className="text-gray-400 text-xs">Completed first training session</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">⭐</div>
              <div>
                <h4 className="text-white font-semibold text-sm">Accuracy Master</h4>
                <p className="text-gray-400 text-xs">Achieved 90%+ accuracy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">🔥</div>
              <div>
                <h4 className="text-white font-semibold text-sm">Week Warrior</h4>
                <p className="text-gray-400 text-xs">7-day training streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}