export default function TranslatorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Gesture Translator</h1>
      <p className="text-gray-400">Real-time gesture recognition and translation</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Camera Feed</h3>
          <div className="bg-black h-64 rounded flex items-center justify-center">
            <p className="text-gray-400">Camera feed will appear here</p>
          </div>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Start Recognition
          </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Translation</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Detected Gesture:</p>
              <p className="text-2xl font-bold text-blue-400">Hello</p>
            </div>
            <div>
              <p className="text-gray-400">Translation:</p>
              <p className="text-lg text-white">Hello, how are you?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}