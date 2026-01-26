export default function HealthPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Health Analytics</h1>
      <p className="text-gray-400">Monitor your gesture training and hand health</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">98.5%</div>
          <div className="text-gray-400">Hand Mobility</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">2.3h</div>
          <div className="text-gray-400">Daily Practice</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">156</div>
          <div className="text-gray-400">Calories Burned</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">12</div>
          <div className="text-gray-400">Streak Days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Weekly Progress</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Progress chart will appear here</p>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Hand Exercises</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
              <div>
                <h4 className="text-white font-semibold">Finger Stretches</h4>
                <p className="text-gray-400 text-sm">5 minutes</p>
              </div>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Complete
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
              <div>
                <h4 className="text-white font-semibold">Wrist Rotations</h4>
                <p className="text-gray-400 text-sm">3 minutes</p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Start
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
              <div>
                <h4 className="text-white font-semibold">Grip Strength</h4>
                <p className="text-gray-400 text-sm">10 minutes</p>
              </div>
              <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                Pending
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Health Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-900/30 border border-green-600 p-4 rounded">
            <h4 className="text-green-400 font-semibold mb-2">Great Progress!</h4>
            <p className="text-gray-300 text-sm">Your hand mobility has improved by 15% this week.</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-600 p-4 rounded">
            <h4 className="text-blue-400 font-semibold mb-2">Take Breaks</h4>
            <p className="text-gray-300 text-sm">Remember to take 5-minute breaks every hour.</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded">
            <h4 className="text-yellow-400 font-semibold mb-2">Stay Hydrated</h4>
            <p className="text-gray-300 text-sm">Proper hydration helps with muscle flexibility.</p>
          </div>
        </div>
      </div>
    </div>
  )
}