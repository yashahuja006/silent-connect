export default function GuidePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">User Guide</h1>
      <p className="text-gray-400">Learn how to use Silent-Connect effectively</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span className="text-gray-300">Set up your camera</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span className="text-gray-300">Calibrate hand detection</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span className="text-gray-300">Start with basic gestures</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Ensure good lighting for better detection</li>
            <li>• Keep hands within camera frame</li>
            <li>• Practice gestures slowly at first</li>
            <li>• Use the education mode for learning</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Video Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 p-4 rounded">
            <div className="bg-black h-32 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">▶ Basic Setup</span>
            </div>
            <h4 className="text-white font-semibold">Getting Started</h4>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <div className="bg-black h-32 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">▶ Hand Gestures</span>
            </div>
            <h4 className="text-white font-semibold">Basic Gestures</h4>
          </div>
          <div className="bg-slate-700 p-4 rounded">
            <div className="bg-black h-32 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">▶ Advanced Tips</span>
            </div>
            <h4 className="text-white font-semibold">Pro Tips</h4>
          </div>
        </div>
      </div>
    </div>
  )
}