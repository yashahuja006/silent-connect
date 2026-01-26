'use client'

import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Simple Sidebar */}
        <div className="w-64 bg-slate-800 min-h-screen p-4">
          <h2 className="text-white text-xl font-bold mb-6">Silent-Connect</h2>
          <nav className="space-y-2">
            <a href="/dashboard" className="block text-gray-300 hover:text-white p-2 rounded">Dashboard</a>
            <a href="/dashboard/demo" className="block text-gray-300 hover:text-white p-2 rounded">Demo</a>
            <a href="/dashboard/translator" className="block text-gray-300 hover:text-white p-2 rounded">Translator</a>
            <a href="/dashboard/education" className="block text-gray-300 hover:text-white p-2 rounded">Education</a>
            <a href="/dashboard/settings" className="block text-gray-300 hover:text-white p-2 rounded">Settings</a>
            <a href="/test-dashboard" className="block text-gray-300 hover:text-white p-2 rounded">Test Dashboard</a>
            <a href="/" className="block text-gray-300 hover:text-white p-2 rounded">Home</a>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}