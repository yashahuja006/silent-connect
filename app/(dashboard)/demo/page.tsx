export default function DemoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">MediaPipe Demo</h1>
      <p className="text-gray-400">Hand tracking functionality demo</p>
      
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Camera Feed</h3>
        <div className="bg-black h-64 rounded flex items-center justify-center">
          <p className="text-gray-400">Camera feed will appear here</p>
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Hand Detection Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Hands Detected:</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          <div>
            <p className="text-gray-400">Status:</p>
            <p className="text-green-400">Ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}