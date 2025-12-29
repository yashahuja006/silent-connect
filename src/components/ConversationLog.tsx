import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '../types'
import { useSound } from '../hooks/useSound'

interface ConversationLogProps {
  messages: Message[]
}

const ConversationLog: React.FC<ConversationLogProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { playPop } = useSound()
  const prevMessageCount = useRef(messages.length)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }

    // Play pop sound when new message is added
    if (messages.length > prevMessageCount.current && messages.length > 0) {
      playPop()
    }
    prevMessageCount.current = messages.length
  }, [messages, playPop])

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getMessageIcon = (type: 'gesture' | 'speech') => {
    return type === 'gesture' ? '👋' : '🎤'
  }

  const getMessageTypeLabel = (type: 'gesture' | 'speech') => {
    return type === 'gesture' ? 'Gesture' : 'Speech'
  }

  return (
    <div className="dark-glass-panel p-6 h-full flex flex-col holographic-scanline">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold neon-gradient-text cyber-heading">Conversation Log</h2>
        <div className="text-sm cyber-subtext">
          {messages.length} message{messages.length === 1 ? '' : 's'}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">💬</div>
              <div className="text-lg mb-2">No messages yet</div>
              <div className="text-sm">
                Start communicating with gestures or speech
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.type === 'gesture' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg backdrop-blur-md border ${
                    message.type === 'gesture' 
                      ? 'bg-cyan-600/20 border-cyan-500/30 text-cyan-100' 
                      : 'bg-slate-700/50 border-slate-600/30 text-gray-100'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getMessageIcon(message.type)}</span>
                      <span className="text-xs font-medium opacity-75">
                        {getMessageTypeLabel(message.type)}
                      </span>
                      {message.confidence && (
                        <span className="text-xs opacity-60">
                          ({Math.round(message.confidence * 100)}%)
                        </span>
                      )}
                    </div>
                    <span className="text-xs opacity-60">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="text-white text-base leading-relaxed font-medium">
                    {message.content}
                  </div>

                  {/* Message Type Indicator */}
                  <div className="mt-2 flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      message.type === 'gesture' ? 'bg-green-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-xs opacity-60">
                      {message.type === 'gesture' ? 'Hand gesture' : 'Voice input'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-xs text-gray-400">
        <div>
          Gestures: {messages.filter(m => m.type === 'gesture').length}
        </div>
        <div>
          Speech: {messages.filter(m => m.type === 'speech').length}
        </div>
        <div>
          Total: {messages.length}
        </div>
      </div>
    </div>
  )
}

export default ConversationLog