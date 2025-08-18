"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BettingOddsBox } from '@/components/betting-odds-box'
import { RelatedArticles } from '@/components/article/related-articles'
import { cn } from '@/lib/utils'

// Sample data for demo
const SAMPLE_ODDS = {
  football: {
    title: "Real Madrid vs Manchester City",
    event: "LaLiga 2025/2026 - Jornada 15",
    matchTime: "2025-07-15 20:00",
    markets: [
      { name: "1X2", options: [{ name: "Real Madrid", odds: "2.10" }, { name: "Empate", odds: "3.20" }, { name: "Manchester City", odds: "3.40" }] },
      { name: "Más/Menos 2.5 Goles", options: [{ name: "Más de 2.5", odds: "1.85" }, { name: "Menos de 2.5", odds: "1.95" }] }
    ]
  }
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  children: React.ReactNode
}

function ChatBubble({ role, children }: ChatBubbleProps) {
  const isUser = role === 'user'
  
  return (
    <div className={cn(
      "flex w-full gap-4 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-bwin-brand-primary flex items-center justify-center">
            <span className="text-xs font-bold text-bwin-neutral-0">BW</span>
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser 
          ? "bg-bwin-brand-primary text-bwin-neutral-0 ml-auto" 
          : "bg-bwin-neutral-20 text-bwin-neutral-90 border border-bwin-neutral-30"
      )}>
        {children}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-bwin-neutral-30 flex items-center justify-center">
            <span className="text-xs font-medium text-bwin-neutral-90">Tú</span>
          </div>
        </div>
      )}
    </div>
  )
}

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
  onNewMessage?: (message: Message) => void
  oddsType?: keyof typeof SAMPLE_ODDS
  messagesEndRef?: React.RefObject<HTMLDivElement>
}

export function ChatMessage({ role, content, isTyping, onNewMessage, oddsType, messagesEndRef }: ChatMessageProps) {
  const showOdds = role === 'assistant' && !isTyping
  const showBetConfirmation = content.toLowerCase().includes('he realizado tu apuesta')

  const handlePlaceBet = (bet: any) => {
    const messageHandler = onNewMessage
    
    if (messageHandler) {
      // Add user message showing the bet details
      messageHandler({
        role: 'user',
        content: `Apuesta: €${bet.stake} en ${bet.selection} (${bet.odds}) - ${bet.event}`
      })
      
      // Add Bot confirmation message
      messageHandler({
        role: 'assistant',
        content: `Tu apuesta ha sido registrada: €${bet.stake} en ${bet.selection} con cuotas ${bet.odds} para ${bet.event}. ¡Buena suerte! 🍀\n\n¿Quieres saber algo más sobre este partido?`
      })
    }
  }

  return (
    <div className="w-full overflow-x-hidden">
      <ChatBubble role={role}>
        <div className="space-y-2">
          {isTyping ? (
            <div className="flex items-center gap-2 text-bwin-neutral-70">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Pensando...</span>
            </div>
          ) : (
            content.split('\n').map((line, i) => (
              <p key={i} className="text-sm leading-relaxed">{line}</p>
            ))
          )}
        </div>
      </ChatBubble>
      
      {showOdds && oddsType && !showBetConfirmation && SAMPLE_ODDS[oddsType] && (
        <div className="mt-4 pl-14 w-full overflow-x-hidden">
          <BettingOddsBox {...SAMPLE_ODDS[oddsType]} onPlaceBet={handlePlaceBet} />
          <div className="mt-6 -mx-0">
            <RelatedArticles currentArticleId="" />
          </div>
        </div>
      )}
      {messagesEndRef && <div ref={messagesEndRef} className="h-2" />}
    </div>
  )
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
              content: '¡Hola! Soy tu asistente de bwin para LaLiga 2025/2026. ¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Excelente pregunta sobre LaLiga. Permíteme mostrarte las últimas cuotas y análisis.",
        "Basándome en el análisis de los equipos, aquí tienes la información que necesitas.",
        "Los datos más recientes sobre este partido muestran oportunidades interesantes para apostar.",
      ]
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)]
      }])
      setIsLoading(false)
    }, 1500)
  }

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  return (
    <div className="flex flex-col h-full bg-bwin-neutral-10">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage
                role={message.role}
                content={message.content}
                onNewMessage={addMessage}
                oddsType={message.role === 'assistant' ? 'football' : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ChatMessage
              role="assistant"
              content=""
              isTyping={true}
            />
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-bwin-neutral-30 p-6 bg-bwin-neutral-10">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre LaLiga..."
            className="w-full py-4 pl-6 pr-14 rounded-2xl bg-bwin-neutral-20 border-2 border-bwin-neutral-30 text-base text-bwin-neutral-100 placeholder:text-bwin-neutral-60 focus:border-bwin-brand-primary focus:ring-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-bwin-brand-primary hover:bg-bwin-brand-secondary text-bwin-neutral-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}