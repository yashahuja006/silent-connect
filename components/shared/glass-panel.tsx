'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  variant?: 'default' | 'card' | 'button' | 'sidebar' | 'modal'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  opacity?: 'low' | 'medium' | 'high'
  border?: boolean
  glow?: boolean
  shimmer?: boolean
  className?: string
}

const variants = {
  default: 'glass-panel',
  card: 'glass-card p-6',
  button: 'glass-button px-4 py-2 cursor-pointer hover:bg-glass-100 transition-all duration-300',
  sidebar: 'sidebar-glass border-r border-glass-border',
  modal: 'glass-panel p-8 max-w-md mx-auto'
}

const blurLevels = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
}

const opacityLevels = {
  low: 'bg-white/5',
  medium: 'bg-white/10',
  high: 'bg-white/15'
}

export function GlassPanel({
  children,
  variant = 'default',
  blur = 'md',
  opacity = 'medium',
  border = true,
  glow = false,
  shimmer = false,
  className,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        // Base glass styles
        variants[variant],
        blurLevels[blur],
        opacityLevels[opacity],
        
        // Conditional styles
        border && 'border border-glass-border',
        glow && 'shadow-cyber cyber-border',
        shimmer && 'glass-shimmer',
        
        // Custom className
        className
      )}
      {...props}
    >
      {children}
      
      {/* Shimmer effect overlay */}
      {shimmer && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-inherit">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-glass-shimmer" />
        </div>
      )}
    </motion.div>
  )
}

// Specialized glass components
export function GlassCard({ children, className, ...props }: Omit<GlassPanelProps, 'variant'>) {
  return (
    <GlassPanel variant="card" className={className} {...props}>
      {children}
    </GlassPanel>
  )
}

export function GlassButton({ children, className, onClick, disabled, ...props }: Omit<GlassPanelProps, 'variant'> & { 
  onClick?: () => void
  disabled?: boolean 
}) {
  return (
    <GlassPanel 
      variant="button" 
      className={cn('inline-flex items-center justify-center', disabled && 'opacity-50 cursor-not-allowed', className)}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      {...props}
    >
      {children}
    </GlassPanel>
  )
}

export function GlassModal({ children, isOpen, onClose, className, ...props }: Omit<GlassPanelProps, 'variant'> & {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal content */}
      <GlassPanel
        variant="modal"
        className={cn('relative z-10', className)}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        {...props}
      >
        {children}
      </GlassPanel>
    </motion.div>
  )
}

// Loading glass panel with skeleton effect
export function GlassLoading({ className, ...props }: Omit<GlassPanelProps, 'children'>) {
  return (
    <GlassPanel className={cn('animate-pulse', className)} {...props}>
      <div className="space-y-3">
        <div className="h-4 bg-white/10 rounded animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
      </div>
    </GlassPanel>
  )
}

// Glass panel with cyber glow effect
export function CyberGlassPanel({ children, className, ...props }: Omit<GlassPanelProps, 'glow'>) {
  return (
    <GlassPanel
      glow
      className={cn('cyber-pulse', className)}
      {...props}
    >
      {children}
    </GlassPanel>
  )
}

// Glass panel with neural network styling
export function NeuralGlassPanel({ children, className, ...props }: GlassPanelProps) {
  return (
    <GlassPanel
      className={cn(
        'neural-border bg-gradient-to-br from-purple-500/5 to-pink-500/5',
        className
      )}
      {...props}
    >
      {children}
    </GlassPanel>
  )
}