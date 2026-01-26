export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h1>
      <p className="text-gray-400">Comprehensive insights into your gesture recognition performance</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">2,847</div>
          <div className="text-gray-400">Total Gestures</div>
          <div className="text-green-400 text-sm mt-1">↗ +12% this week</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">91.7%</div>
          <div className="text-gray-400">Success Rate</div>
          <div className="text-green-400 text-sm mt-1">↗ +3.2% this week</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">127.5h</div>
          <div className="text-gray-400">Total Practice</div>
          <div className="text-blue-400 text-sm mt-1">↗ +8.5h this week</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">23</div>
          <div className="text-gray-400">Active Days</div>
          <div className="text-green-400 text-sm mt-1">↗ +2 this month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Performance Trends</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Performance chart will appear here</p>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Gesture Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Hello</span>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-600 h-2 w-32 rounded">
                  <div className="bg-green-600 h-2 rounded" style={{width: '95%'}}></div>
                </div>
                <span className="text-green-400 text-sm">95%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Thank You</span>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-600 h-2 w-32 rounded">
                  <div className="bg-blue-600 h-2 rounded" style={{width: '88%'}}></div>
                </div>
                <span className="text-blue-400 text-sm">88%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Please</span>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-600 h-2 w-32 rounded">
                  <div className="bg-purple-600 h-2 rounded" style={{width: '92%'}}></div>
                </div>
                <span className="text-purple-400 text-sm">92%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Yes</span>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-600 h-2 w-32 rounded">
                  <div className="bg-yellow-600 h-2 rounded" style={{width: '97%'}}></div>
                </div>
                <span className="text-yellow-400 text-sm">97%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">No</span>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-600 h-2 w-32 rounded">
                  <div className="bg-red-600 h-2 rounded" style={{width: '85%'}}></div>
                </div>
                <span className="text-red-400 text-sm">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Weekly Activity</h2>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-gray-400 text-xs mb-2">{day}</div>
                <div className={`h-16 rounded ${index < 5 ? 'bg-green-600' : index === 5 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className="text-xs text-gray-400 mt-1">{index < 5 ? '2.5h' : index === 5 ? '1.8h' : '0h'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Achievements</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">🏆</div>
              <div>
                <h4 className="text-white font-semibold">Accuracy Champion</h4>
                <p className="text-gray-400 text-sm">Achieved 95%+ accuracy for 5 consecutive days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">⭐</div>
              <div>
                <h4 className="text-white font-semibold">Speed Demon</h4>
                <p className="text-gray-400 text-sm">Performed 20+ gestures per minute</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">🔥</div>
              <div>
                <h4 className="text-white font-semibold">Consistency King</h4>
                <p className="text-gray-400 text-sm">Maintained 90%+ accuracy for 2 weeks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}