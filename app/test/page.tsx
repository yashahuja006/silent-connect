export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">✅ Test Page Works!</h1>
        <p className="text-gray-400">If you can see this, routing is working correctly.</p>
        <div className="mt-8 space-y-2">
          <a href="/" className="block text-blue-400 hover:text-blue-300">← Go to Homepage</a>
          <a href="/test-dashboard" className="block text-blue-400 hover:text-blue-300">Go to Test Dashboard →</a>
          <a href="/dashboard" className="block text-blue-400 hover:text-blue-300">Go to Full Dashboard →</a>
        </div>
      </div>
    </div>
  )
}