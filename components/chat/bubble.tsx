"use client"

import { cn } from '@/lib/utils'
import { ChatAvatar } from './avatar'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  children: React.ReactNode
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 px-4 w-full max-w-full overflow-hidden",
      role === 'user' && "flex-row-reverse"
    )}>
      <ChatAvatar role={role} />
      <div className={cn(
        "relative flex flex-col w-full md:max-w-[70%] px-4 py-3 rounded-2xl overflow-hidden",
        role === 'assistant' 
          ? "bg-secondary text-foreground rounded-tl-none" 
          : "bg-blue-50 dark:bg-blue-900/20 text-foreground rounded-tr-none ml-auto"
      )}>
        <div className="w-full overflow-x-hidden break-words">
          {children}
        </div>
      </div>
    </div>
  )
}