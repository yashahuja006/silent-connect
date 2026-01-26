export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Command Center</h1>
      <p className="text-gray-400">Welcome back! Here's your gesture training overview.</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">1,247</div>
          <div className="text-gray-400">Total Gestures</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">87.3%</div>
          <div className="text-gray-400">Avg Accuracy</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">42.5h</div>
          <div className="text-gray-400">Practice Hours</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">7</div>
          <div className="text-gray-400">Current Streak</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Activity chart will appear here</p>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/dashboard/demo" className="block bg-green-600 text-white p-3 rounded hover:bg-green-700">
              Start Demo
            </a>
            <a href="/dashboard/translator" className="block bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
              Translator
            </a>
            <a href="/dashboard/education" className="block bg-purple-600 text-white p-3 rounded hover:bg-purple-700">
              Education
            </a>
            <a href="/dashboard/settings" className="block bg-gray-600 text-white p-3 rounded hover:bg-gray-700">
              Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}