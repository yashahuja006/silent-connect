'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react'
import { GlassPanel } from '@/components/shared/glass-panel'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-glass backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Menu and Search */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search gestures, commands..."
                className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-electric-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Center - Logo/Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-400 to-violet-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <h1 className="text-xl font-heading text-white hidden sm:block">
            Silent-Connect
          </h1>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 z-50"
              >
                <GlassPanel className="p-4">
                  <h3 className="text-white font-medium mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-electric-400 rounded-full mt-2" />
                        <div>
                          <p className="text-white text-sm">New gesture learned!</p>
                          <p className="text-gray-400 text-xs">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                        <div>
                          <p className="text-white text-sm">Training session completed</p>
                          <p className="text-gray-400 text-xs">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm hidden md:block">User</span>
            </button>

            {/* Profile dropdown */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-48 z-50"
              >
                <GlassPanel className="p-2">
                  <div className="space-y-1">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Settings</span>
                    </button>
                    <hr className="border-white/10 my-2" />
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-left">
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">Sign out</span>
                    </button>
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-electric-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowProfile(false)
          }}
        />
      )}
    </header>
  )
}