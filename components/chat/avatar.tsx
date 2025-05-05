"use client"

import { User, Bot } from 'lucide-react'
import { cn } from '@/libs/utils'

interface ChatAvatarProps {
  role: 'user' | 'assistant'
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <div className={cn(
      "flex items-center justify-center w-10 h-10 rounded-full",
      role === 'assistant' 
        ? "bg-primary/10 text-primary" 
        : "bg-blue-500/10 text-blue-500"
    )}>
      {role === 'assistant' ? (
        <Bot className="w-5 h-5" />
      ) : (
        <User className="w-5 h-5" />
      )}
    </div>
  )
}