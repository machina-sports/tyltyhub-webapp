"use client"

import { useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBrandTexts } from "@/hooks/use-brand-texts"
import { useBrandConfig } from "@/contexts/brand-context"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isTyping: boolean
  className?: string
}

export function ChatInput({ 
  input, 
  setInput, 
  onSubmit, 
  isTyping, 
  className = "" 
}: ChatInputProps) {
  const { chat } = useBrandTexts();
  const brand = useBrandConfig();
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input after message is sent (fixes iOS issue)
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      // Small delay to ensure input is visible
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [isTyping])

  return (
    <div className={`backdrop-blur-md border-t p-4 pb-safe chat-input-container ${className}`} style={{ 
      borderColor: 'hsl(var(--brand-primary) / 0.2)'
    }}>
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto relative tap-highlight-none">
        <Input
          ref={inputRef}
          readOnly={isTyping}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Conversa com ${brand.displayName}...`}
          className="w-full h-12 pl-4 pr-12 rounded-lg text-bwin-neutral-100 placeholder:text-bwin-neutral-60 border border-bwin-neutral-30 focus:border-bwin-primary focus:ring-0 transition-colors chat-input-field"
          style={{
            backgroundColor: 'hsl(var(--bg-secondary))',
            WebkitAppearance: 'none',
            WebkitTapHighlightColor: 'transparent',
            fontSize: '16px' // Prevents zoom on iOS
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-white hover:text-neutral-100 hover:bg-brand-primary/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
