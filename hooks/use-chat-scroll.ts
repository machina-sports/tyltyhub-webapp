"use client"

import { useEffect, useRef } from 'react'

export function useChatScroll(messages: any[], isTyping: boolean) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Scroll on new messages or typing indicator
  useEffect(() => {
    if (isTyping) {
      scrollToBottom('auto')
    } else if (messages.length > 0) {
      // For user messages, scroll immediately
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        scrollToBottom('auto')
      } else {
        // For assistant messages, scroll after content is displayed
        scrollToBottom('auto')
      }
    }
  }, [messages, isTyping])

  return { messagesEndRef }
}