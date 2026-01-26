'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  GraduationCap, 
  Home, 
  Activity, 
  Brain, 
  BookOpen,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  User
} from 'lucide-react'
import { GlassPanel } from '@/components/shared/glass-panel'
import { cn } from '@/lib/utils/cn'

interface AppSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Overview and analytics',
    color: 'text-cyber-400'
  },
  {
    title: 'Test Dashboard',
    href: '/test-dashboard',
    icon: Shield,
    description: 'Simple demo interface',
    color: 'text-green-400'
  },
  {
    title: 'Demo',
    href: '/dashboard/demo',
    icon: Activity,
    description: 'MediaPipe hand tracking demo',
    color: 'text-orange-400'
  },
  {
    title: 'Translator',
    href: '/dashboard/translator',
    icon: MessageCircle,
    description: 'Real-time gesture translation',
    color: 'text-blue-400'
  },
  {
    title: 'Sign Guide',
    href: '/dashboard/guide',
    icon: BookOpen,
    description: 'Learn gesture meanings',
    color: 'text-green-400'
  },
  {
    title: 'Education',
    href: '/dashboard/education',
    icon: GraduationCap,
    description: 'Quiz Master learning suite',
    color: 'text-purple-400'
  },
  {
    title: 'Smart Home',
    href: '/dashboard/smart-home',
    icon: Home,
    description: 'IoT device control',
    color: 'text-yellow-400'
  },
  {
    title: 'Health Data',
    href: '/dashboard/health',
    icon: Activity,
    description: 'Rehabilitation analytics',
    color: 'text-red-400'
  },
  {
    title: 'AI Trainer',
    href: '/dashboard/ai-trainer',
    icon: Brain,
    description: 'Custom gesture studio',
    color: 'text-pink-400'
  }
]

const bottomItems = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'App preferences',
    color: 'text-gray-400'
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Usage statistics',
    color: 'text-indigo-400'
  }
]

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={collapsed ? { width: '80px' } : { width: '280px' }}
        className={cn(
          'hidden lg:flex flex-col h-full',
          'sidebar-glass border-r border-glass-border',
          'relative z-30'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-cyber-gradient font-cyber">
                    Silent-Connect
                  </h1>
                  <p className="text-xs text-gray-400">v3.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg glass-button hover:bg-glass-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.href}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-glass-100 hover:border-glass-border',
                    isActive && 'bg-glass-100 border border-glass-border cyber-border',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className={cn('w-5 h-5', item.color, isActive && 'text-cyber-400')} />
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 min-w-0"
                      >
                        <div className={cn(
                          'font-medium text-sm',
                          isActive ? 'text-white' : 'text-gray-300'
                        )}>
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-glass-border space-y-2">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                  'hover:bg-glass-100',
                  isActive && 'bg-glass-100 border border-glass-border',
                  collapsed && 'justify-center'
                )}
              >
                <Icon className={cn('w-5 h-5', item.color)} />
                
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-white' : 'text-gray-300'
                      )}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}

          {/* User profile */}
          <div className={cn(
            'flex items-center space-x-3 px-3 py-2 mt-4',
            collapsed && 'justify-center'
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-sm font-medium text-white truncate">
                    Yash Ahuja
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    Premium User
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-80 lg:hidden',
              'sidebar-glass border-r border-glass-border'
            )}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-cyber-gradient font-cyber">
                    Silent-Connect
                  </h1>
                  <p className="text-xs text-gray-400">v3.0</p>
                </div>
              </div>
              
              <button
                onClick={onToggle}
                className="p-2 rounded-lg glass-button hover:bg-glass-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.href}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <Link
                      href={item.href}
                      onClick={onToggle}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200',
                        'hover:bg-glass-100',
                        isActive && 'bg-glass-100 border border-glass-border cyber-border'
                      )}
                    >
                      <Icon className={cn('w-5 h-5', item.color, isActive && 'text-cyber-400')} />
                      <div className="flex-1">
                        <div className={cn(
                          'font-medium text-sm',
                          isActive ? 'text-white' : 'text-gray-300'
                        )}>
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Mobile bottom section */}
            <div className="p-4 border-t border-glass-border space-y-2">
              {bottomItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onToggle}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                      'hover:bg-glass-100',
                      isActive && 'bg-glass-100 border border-glass-border'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', item.color)} />
                    <span className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-white' : 'text-gray-300'
                    )}>
                      {item.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}