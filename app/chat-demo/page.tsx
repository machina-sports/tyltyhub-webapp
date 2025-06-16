"use client"

import { useState, useRef, useEffect } from 'react'
import { Search, TrendingUp, Trophy, Calendar, Zap, Users, Star, Globe, Target, DollarSign, Medal, Award, Icon, LucideIcon, Send, Mic } from 'lucide-react'
import { soccerBall } from '@lucide/lab'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from '@/components/chat-demo'
import { cn } from '@/lib/utils'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatState } from '@/hooks/use-chat-state'
import { Dot, SportingbetDot } from '@/components/ui/dot'
import { motion } from 'framer-motion'

type SuggestionItem = {
  text: string;
  icon?: LucideIcon;
  iconNode?: typeof soccerBall;
  isLabIcon?: boolean;
}

const suggestions: SuggestionItem[] = [
  { icon: Zap, text: "Como apostar no Mundial de Clubes?" },
  { icon: TrendingUp, text: "Quais as odds pro Real Madrid no Mundial?" },
  { icon: Trophy, text: "Quem deve marcar em City vs Flamengo?" },
  { icon: Calendar, text: "Quando começa o Mundial de Clubes 2025?" },
  { icon: Star, text: "Quais times são favoritos no Mundial?" },
  { 
    iconNode: soccerBall, 
    text: "Melhores apostas para gols no Mundial?",
    isLabIcon: true 
  },
  { icon: Users, text: "Quais jogadores vão participar do Mundial?" },
  { icon: Globe, text: "Onde será o Mundial de Clubes 2025?" },
  { icon: Target, text: "Chances do Fluminense no Mundial?" },
  { icon: DollarSign, text: "Qual a premiação do Mundial de Clubes?" },
  { icon: Medal, text: "Quem foi o artilheiro do último Mundial?" },
  { icon: Award, text: "Qual time tem mais títulos no Mundial?" },
]

export default function Home() {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1) // -1 means input is focused
  const { 
    messages, 
    showInitial, 
    isTyping, 
    addMessage, 
    setIsTyping 
  } = useChatState()
  const { messagesEndRef } = useChatScroll(messages, isTyping)
  const inputRef = useRef<HTMLInputElement>(null)
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Focus input on mount
  useEffect(() => {
    if (showInitial && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showInitial])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showInitial) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = prev + 1
          if (newIndex >= suggestions.length) return 0
          return newIndex
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = prev - 1
          if (newIndex < -1) return suggestions.length - 1
          return newIndex
        })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSampleQuery(suggestions[selectedIndex].text)
        } else if (input.trim()) {
          handleSubmit(e as any)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedIndex(-1)
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showInitial, selectedIndex, input])

  // Focus input when selectedIndex is -1
  useEffect(() => {
    if (selectedIndex === -1 && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Determine the oddsType based on the input
    let oddsType: string | null = null
    if (input.toLowerCase().includes("real madrid") || input.toLowerCase().includes("al ahly")) {
      oddsType = "cwc-group-a"
    } else if (input.toLowerCase().includes("manchester city") || input.toLowerCase().includes("flamengo")) {
      oddsType = "cwc-group-b"
    } else if (input.toLowerCase().includes("mundial de clubes") || input.toLowerCase().includes("fifa cwc")) {
      oddsType = "cwc-general"
    } else if (input.toLowerCase().includes("final") || input.toLowerCase().includes("winner") || input.toLowerCase().includes("vencedor")) {
      oddsType = "cwc-final"
    }

    // Add user message immediately
    addMessage({ role: 'user', content: input })
    setInput('')
    setSelectedIndex(-1)

    // Show typing indicator for assistant response
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add assistant response with oddsType
    addMessage({ 
      role: 'assistant', 
      content: `Com base nos últimos dados e odds do Mundial de Clubes da FIFA, achei isso aqui pra "${input}". Destaquei as melhores oportunidades de aposta pra você.`,
      oddsType: oddsType
    })
    setIsTyping(false)
  }

  const handleSampleQuery = (query: string) => {
    setInput(query)
    setSelectedIndex(-1)
    // Submit immediately
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as any)
    }, 100)
  }

  // Add microphone handling functions
  const handleMicPress = () => {
    setIsPreparing(true)
    
    // Clear any existing timer just in case
    if (prepareTimeoutRef.current) {
      clearTimeout(prepareTimeoutRef.current);
    }

    // Start a timer for the preparation phase
    prepareTimeoutRef.current = setTimeout(() => {
      // If this timer completes, transition to recording state
      setIsPreparing(false)
      setIsRecording(true)
      // Here you would add the actual microphone recording logic
      console.log('Started recording')
      prepareTimeoutRef.current = null; // Clear the ref after execution
    }, 500)
  }
  
  const handleMicRelease = () => {
    // If there's an active preparation timer, clear it
    if (prepareTimeoutRef.current) {
      clearTimeout(prepareTimeoutRef.current);
      prepareTimeoutRef.current = null;
    }

    // If released during preparation phase, just reset state
    if (isPreparing) {
      setIsPreparing(false)
      return
    }
    
    // If we were actually recording, stop and start transcription
    if (isRecording) {
      setIsRecording(false)
      // Here you would stop recording and process the audio
      console.log('Stopped recording')
      
      // Show transcribing state
      setIsTranscribing(true)
      
      // Simulate speech-to-text processing after a delay
      setTimeout(() => {
        // Mock result from speech-to-text
        const mockTranscription = "Quais são as odds para o Real Madrid ganhar o Mundial?"
        setInput(mockTranscription)
        setIsTranscribing(false)
      }, 1500)
    }
  }

  // Get placeholder text based on recording state
  const getInputPlaceholder = () => {
    if (isPreparing) return "Preparando..."
    if (isRecording) return "Gravando..."
    if (isTranscribing) return "Transcrevendo..."
    return "Busque por times, jogos ou odds..."
  }

  return (
    <div className="flex flex-col h-screen bg-background pt-16 md:pt-0">
      <div className="flex-1 overflow-auto hide-scrollbar momentum-scroll pb-32 pt-4 md:pb-24">
        {showInitial ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
            {/* Banner */}
            <img className="w-full mb-0 max-w-[980px] mt-12 md:mt-0" src="/kv-txt-op1_980x250px_bot_.gif" alt="Sportingbet Banner" />
            
            <h1 className="text-center mb-4 sm:mb-6 flex items-center gap-3 justify-center pt-10 pb-6 sm:pt-14 sm:pb-10">
              Vamos jogar juntos? Me diz onde você precisa de reforço!
              <SportingbetDot size={28} className="ml-1" />
            </h1>
            <div className="w-full max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  className={cn(
                    "w-full h-10 md:h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0 shadow-sm text-base",
                    selectedIndex === -1 && "ring-2 ring-primary/50",
                    isPreparing && "animate-pulse text-amber-600",
                    isRecording && "animate-pulse text-red-600",
                    isTranscribing && "animate-pulse"
                  )}
                  readOnly={isPreparing || isRecording || isTranscribing}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {input.trim() ? (
                    <Button 
                      type="submit" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 hover:bg-secondary/80 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : isTranscribing ? (
                    <Button 
                      type="button"
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 hover:bg-secondary/80 transition-colors opacity-50"
                      disabled
                    >
                      <span className="h-4 w-4 block rounded-full bg-muted-foreground/30 animate-pulse"></span>
                    </Button>
                  ) : (
                    <Button 
                      type="button"
                      size="icon" 
                      variant="ghost" 
                      className={cn(
                        "h-8 w-8 hover:bg-secondary/80 transition-colors hidden",
                        isPreparing && "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 hover:text-amber-600",
                        isRecording && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
                      )}
                      onMouseDown={handleMicPress}
                      onMouseUp={handleMicRelease}
                      onTouchStart={handleMicPress}
                      onTouchEnd={handleMicRelease}
                      aria-label="Hold to record voice message"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Questions List */}
            <div className="mt-6 w-full max-w-xl mx-auto">
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      selectedIndex === index
                        ? "bg-primary/10 border-2 border-primary/50 shadow-sm"
                        : "hover:bg-secondary/40 border-2 border-transparent"
                    )}
                    onClick={() => handleSampleQuery(suggestion.text)}
                  >
                    {/* Dot indicator */}
                    <div className="flex-shrink-0">
                      <SportingbetDot 
                        size={16} 
                        className={cn(
                          "transition-opacity duration-200",
                          selectedIndex === index ? "opacity-100" : "opacity-30"
                        )} 
                      />
                    </div>
                    
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {suggestion.isLabIcon && suggestion.iconNode ? (
                        <Icon 
                          iconNode={suggestion.iconNode} 
                          className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            selectedIndex === index 
                              ? "text-primary" 
                              : "text-muted-foreground/60"
                          )} 
                        />
                      ) : suggestion.icon ? (
                        <suggestion.icon 
                          className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            selectedIndex === index 
                              ? "text-primary" 
                              : "text-muted-foreground/60"
                          )} 
                        />
                      ) : null}
                    </div>
                    
                    {/* Text */}
                    <span className={cn(
                      "text-base transition-colors duration-200",
                      selectedIndex === index 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground"
                    )}>
                      {suggestion.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation hint */}
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground/60">
                  Use ↑↓ para navegar • Enter para confirmar • Esc para o campo de busca
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-2xl overflow-x-hidden pb-8">
            <div className="flex flex-col space-y-4 px-4 w-full">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  role={message.role}
                  content={message.content}
                  oddsType={message.oddsType}
                  messagesEndRef={index === messages.length - 1 ? messagesEndRef : undefined} 
                />
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
                  <SportingbetDot size={16} className="text-foreground" />
                  <span className="text-sm">Digitando...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!showInitial && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-secondary/30 backdrop-blur-sm pb-safe z-10">
          <div className="mx-auto max-w-2xl px-4 py-2 md:py-4">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className={cn(
                  "w-full py-6 pl-4 pr-12 rounded-lg bg-white shadow-sm border-0 text-base",
                  isPreparing && "animate-pulse text-amber-600",
                  isRecording && "animate-pulse text-red-600",
                  isTranscribing && "animate-pulse"
                )}
                readOnly={isPreparing || isRecording || isTranscribing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {input.trim() ? (
                  <Button 
                    type="submit" 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 hover:bg-secondary active:bg-secondary/80 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                ) : isTranscribing ? (
                  <Button 
                    type="button"
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 hover:bg-secondary active:bg-secondary/80 transition-colors opacity-50"
                    disabled
                  >
                    <span className="h-4 w-4 block rounded-full bg-muted-foreground/30 animate-pulse"></span>
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className={cn(
                      "h-9 w-9 hover:bg-secondary active:bg-secondary/80 transition-colors hidden",
                      isPreparing && "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 hover:text-amber-600",
                      isRecording && "bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-600"
                    )}
                    onMouseDown={handleMicPress}
                    onMouseUp={handleMicRelease}
                    onTouchStart={handleMicPress}
                    onTouchEnd={handleMicRelease}
                    aria-label="Hold to record voice message"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}