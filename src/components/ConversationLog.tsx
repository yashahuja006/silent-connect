import React, { useEffect, useRef } from 'react'
import { Message } from '../types'

interface ConversationLogProps {
  messages: Message[]
}

const ConversationLog: React.FC<ConversationLogProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
    <div className="cyber-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyber-cyan">Conversation Log</h2>
        <div className="text-sm text-gray-400">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
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
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-cyber-darker rounded-lg p-4 border border-cyber-teal/20 hover:border-cyber-teal/40 transition-colors"
            >
              {/* Message Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getMessageIcon(message.type)}</span>
                  <span className="text-sm font-medium text-cyber-teal">
                    {getMessageTypeLabel(message.type)}
                  </span>
                  {message.confidence && (
                    <span className="text-xs text-gray-400">
                      ({Math.round(message.confidence * 100)}%)
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {/* Message Content */}
              <div className="text-white text-lg leading-relaxed">
                {message.content}
              </div>

              {/* Message Type Indicator */}
              <div className="mt-2 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  message.type === 'gesture' ? 'bg-cyber-green' : 'bg-cyber-blue'
                }`} />
                <span className="text-xs text-gray-400">
                  {message.type === 'gesture' ? 'Hand gesture detected' : 'Voice input processed'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-cyber-gray flex justify-between text-xs text-gray-400">
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