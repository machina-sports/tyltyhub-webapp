"use client"

import { useState } from 'react'
import { Search, TrendingUp, Trophy, Calendar, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from '@/components/chat-message'
import { cn } from '@/lib/utils'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatState } from '@/hooks/use-chat-state'
import { Dot } from '@/components/ui/dot'

const suggestions = [
  { icon: TrendingUp, text: "What are the odds for Real Madrid today?" },
  { icon: Zap, text: "Is Man City favored against Flamengo?" },
  { icon: Trophy, text: "Who's likely to score in Bayern vs Inter?" },
  { icon: Calendar, text: "Can Flamengo win their match?" }
]

export default function Home() {
  const [input, setInput] = useState('')
  const { 
    messages, 
    showInitial, 
    isTyping, 
    addMessage, 
    setIsTyping 
  } = useChatState()
  const { messagesEndRef } = useChatScroll(messages, isTyping)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Determine the oddsType based on the input
    let oddsType: string | null = null
    if (input.toLowerCase().includes("real madrid") || input.toLowerCase().includes("al ahly")) {
      oddsType = "cwc-group-a"
    } else if (input.toLowerCase().includes("manchester city") || input.toLowerCase().includes("flamengo")) {
      oddsType = "cwc-group-b"
    } else if (input.toLowerCase().includes("club world cup") || input.toLowerCase().includes("fifa cwc")) {
      oddsType = "cwc-general"
    } else if (input.toLowerCase().includes("final") || input.toLowerCase().includes("winner")) {
      oddsType = "cwc-final"
    }

    // Add user message immediately
    addMessage({ role: 'user', content: input })
    setInput('')

    // Show typing indicator for assistant response
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add assistant response with oddsType
    addMessage({ 
      role: 'assistant', 
      content: `Based on the latest FIFA Club World Cup data and odds, here's what I found for "${input}". I've highlighted the best betting opportunities below.`,
      oddsType: oddsType
    })
    setIsTyping(false)
  }

  const handleSampleQuery = (query: string) => {
    setInput(query)
  }

  return (
    <div className="flex flex-col h-screen bg-background pt-16 md:pt-0">
      <div className="flex-1 overflow-auto">
        {showInitial ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
            <h1 className="text-center mb-6 sm:mb-8 flex items-center gap-3 justify-center">
              What would you like to bet on
              <Dot size={28} color="#F13131" className="ml-1" />
            </h1>
            <div className="w-full max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search for teams, matches, or Club World Cup odds..."
                  className="w-full h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-2 w-full max-w-xl mx-auto">
              {suggestions.map(({ icon: Icon, text }, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                  onClick={() => handleSampleQuery(text)}
                >
                  <Icon className="h-4 w-4 mr-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-6">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                {...message} 
                onNewMessage={addMessage}
                isTyping={false}
              />
            ))}
            {isTyping && (
              <ChatMessage
                role="assistant"
                content=""
                isTyping={true}
                onNewMessage={addMessage}
              />
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        )}
      </div>
      {!showInitial && (
        <div className="fixed md:sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 mobile-safe-bottom">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative tap-highlight-none">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about FIFA Club World Cup odds, teams, or matches..."
              className="w-full h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}