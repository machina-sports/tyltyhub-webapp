"use client"

import { cn } from '@/lib/utils'
import { ChatAvatar } from './avatar'
import { useTheme } from '@/components/theme-provider'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  children: React.ReactNode
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "flex items-start gap-3 px-4 w-full",
      role === 'user' && "flex-row-reverse"
    )}>
      <ChatAvatar role={role} />
      <div className={cn(
        "relative flex flex-col w-full md:max-w-[70%] px-4 py-3 rounded-2xl overflow-x-hidden break-words",
        role === 'assistant' 
          ? isDarkMode 
            ? "bg-[#061F3F] text-[#D3ECFF] rounded-tl-none border border-[#45CAFF]/30" 
            : "bg-secondary text-foreground rounded-tl-none"
          : isDarkMode
            ? "bg-[#45CAFF]/10 text-[#D3ECFF] rounded-tr-none ml-auto border border-[#45CAFF]/30"
            : "bg-blue-50 text-foreground rounded-tr-none ml-auto"
      )}>
        <div className="w-full overflow-hidden break-words">
          {children}
        </div>
      </div>
    </div>
  )
}