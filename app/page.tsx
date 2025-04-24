"use client"

import { useState, useRef, useEffect } from 'react'
import { Search, TrendingUp, Trophy, Calendar, Zap, Users, Star, Globe, Target, DollarSign, Medal, Award, Icon, LucideIcon } from 'lucide-react'
import { soccerBall } from '@lucide/lab'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from '@/components/chat-message'
import { cn } from '@/lib/utils'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useChatState } from '@/hooks/use-chat-state'
import { Dot, SportingbetDot } from '@/components/ui/dot'
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel'
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
  const { 
    messages, 
    showInitial, 
    isTyping, 
    addMessage, 
    setIsTyping 
  } = useChatState()
  const { messagesEndRef } = useChatScroll(messages, isTyping)
  const [api, setApi] = useState<CarouselApi>()
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Refs for DOM elements, scroll positions, and animation frames
  const [isFirstRowScrolling, setIsFirstRowScrolling] = useState(true); // Control first row
  const [isSecondRowScrolling, setIsSecondRowScrolling] = useState(true); // Control second row
  const firstRowRef = useRef<HTMLDivElement>(null)
  const secondRowRef = useRef<HTMLDivElement>(null)
  const firstRowContentRef = useRef<HTMLDivElement>(null)
  const secondRowContentRef = useRef<HTMLDivElement>(null)
  const firstRowPositionRef = useRef(0);
  const secondRowPositionRef = useRef(0);
  const firstAnimationFrameIdRef = useRef<number | null>(null);
  const secondAnimationFrameIdRef = useRef<number | null>(null);
  
  // Auto-scroll animation using requestAnimationFrame
  useEffect(() => {
    // --- First Row Animation --- 
    const firstRowAnimation = () => {
      if (!isFirstRowScrolling || !firstRowRef.current || !firstRowContentRef.current) {
        return; // Stop if paused or refs are null
      }
      
      firstRowPositionRef.current += 0.5;
      const contentWidth = firstRowContentRef.current.offsetWidth;
      if (firstRowPositionRef.current >= contentWidth) {
        firstRowPositionRef.current = 0;
      }
      if (firstRowRef.current) { 
        firstRowRef.current.style.transform = `translateX(-${firstRowPositionRef.current}px)`;
      }
      
      firstAnimationFrameIdRef.current = requestAnimationFrame(firstRowAnimation);
    };

    // Start/Stop first row animation based on its state
    if (isFirstRowScrolling) {
      if (firstAnimationFrameIdRef.current) cancelAnimationFrame(firstAnimationFrameIdRef.current);
      firstAnimationFrameIdRef.current = requestAnimationFrame(firstRowAnimation);
    } else {
       if (firstAnimationFrameIdRef.current) cancelAnimationFrame(firstAnimationFrameIdRef.current);
    }
    
    // --- Second Row Animation --- 
    const secondRowAnimation = () => {
      if (!isSecondRowScrolling || !secondRowRef.current || !secondRowContentRef.current) {
        return; // Stop if paused or refs are null
      }
      
      // For left-to-right scrolling (we need to initialize at negative position)
      secondRowPositionRef.current += 0.5; 
      const contentWidth = secondRowContentRef.current.offsetWidth;
      
      // Reset position when content has fully entered from the left
      if (secondRowPositionRef.current > 0 && secondRowPositionRef.current >= contentWidth) {
        // Jump back to negative position to create continuous appearance
        secondRowPositionRef.current = -contentWidth;
      }
      
      if (secondRowRef.current) { 
        secondRowRef.current.style.transform = `translateX(${secondRowPositionRef.current}px)`;
      }
      
      secondAnimationFrameIdRef.current = requestAnimationFrame(secondRowAnimation);
    };
    
    // Start/Stop second row animation based on its state
    if (isSecondRowScrolling) {
       if (secondAnimationFrameIdRef.current) cancelAnimationFrame(secondAnimationFrameIdRef.current);
       secondAnimationFrameIdRef.current = requestAnimationFrame(secondRowAnimation);
    } else {
       if (secondAnimationFrameIdRef.current) cancelAnimationFrame(secondAnimationFrameIdRef.current);
    }

    // Cleanup: Cancel animation frames when component unmounts
    return () => {
      if (firstAnimationFrameIdRef.current) {
        cancelAnimationFrame(firstAnimationFrameIdRef.current);
      }
      if (secondAnimationFrameIdRef.current) {
        cancelAnimationFrame(secondAnimationFrameIdRef.current);
      }
    };
    // Rerun effect if either scrolling state changes
  }, [isFirstRowScrolling, isSecondRowScrolling]); 

  // Initialize second row position when component mounts
  useEffect(() => {
    // Initialize second row at negative position to create illusion of infinite scroll
    if (secondRowContentRef.current && secondRowRef.current) {
      const width = secondRowContentRef.current.offsetWidth;
      secondRowPositionRef.current = -width; // Start off-screen to the left
      secondRowRef.current.style.transform = `translateX(${secondRowPositionRef.current}px)`;
    }
  }, []);

  // Hover handlers remain simple state toggles
  const pauseFirstRow = () => setIsFirstRowScrolling(false);
  const resumeFirstRow = () => setIsFirstRowScrolling(true);
  const pauseSecondRow = () => setIsSecondRowScrolling(false);
  const resumeSecondRow = () => setIsSecondRowScrolling(true);

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
  }

  return (
    <div className="flex flex-col h-screen bg-background pt-16 md:pt-0">
      <div className="flex-1 overflow-auto">
        {showInitial ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
            <h1 className="text-center mb-6 sm:mb-8 flex items-center gap-3 justify-center">
              Qual vai ser a sua aposta?
              <SportingbetDot size={28} className="ml-1" />
            </h1>
            <div className="w-full max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Busque por times, jogos ou odds do Mundial de Clubes..."
                  className="w-full h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-6 sm:mt-8 w-full max-w-xl mx-auto">
              <div className="w-full relative flex flex-col gap-3">
                <div 
                  className="relative overflow-hidden"
                  onMouseEnter={pauseFirstRow}
                  onMouseLeave={resumeFirstRow}
                >
                  <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
                  <div className="flex overflow-hidden">
                    <div ref={firstRowRef} className="flex w-full"> 
                      <div ref={firstRowContentRef} className="flex gap-2 py-1">
                        {suggestions.slice(0, 6).map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                            onClick={() => handleSampleQuery(suggestion.text)}
                          >
                            {suggestion.isLabIcon && suggestion.iconNode ? (
                              <Icon 
                                iconNode={suggestion.iconNode} 
                                className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" 
                              />
                            ) : suggestion.icon ? (
                              <suggestion.icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            ) : null}
                            {suggestion.text}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-2 py-1">
                        {suggestions.slice(0, 6).map((suggestion, index) => (
                          <motion.button
                            key={`dup1-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                            onClick={() => handleSampleQuery(suggestion.text)}
                          >
                            {suggestion.isLabIcon && suggestion.iconNode ? (
                              <Icon 
                                iconNode={suggestion.iconNode} 
                                className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" 
                              />
                            ) : suggestion.icon ? (
                              <suggestion.icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            ) : null}
                            {suggestion.text}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-2 py-1">
                        {suggestions.slice(0, 6).map((suggestion, index) => (
                          <motion.button
                            key={`dup2-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                            onClick={() => handleSampleQuery(suggestion.text)}
                          >
                            {suggestion.isLabIcon && suggestion.iconNode ? (
                              <Icon 
                                iconNode={suggestion.iconNode} 
                                className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" 
                              />
                            ) : suggestion.icon ? (
                              <suggestion.icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            ) : null}
                            {suggestion.text}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="relative overflow-hidden"
                  onMouseEnter={pauseSecondRow}
                  onMouseLeave={resumeSecondRow}
                >
                  <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
                  <div className="flex overflow-hidden">
                    <div ref={secondRowRef} className="flex w-full"> 
                      {/* Initial set - Full rotation of all 12 suggestions for continuous flow */}
                      <div ref={secondRowContentRef} className="flex gap-2 py-1">
                        {/* Use full suggestions array - second half first */}
                        {[...suggestions.slice(6, 12), ...suggestions.slice(0, 6)].map((suggestion, index) => (
                          <motion.button
                            key={`orig-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                            onClick={() => handleSampleQuery(suggestion.text)}
                          >
                            {suggestion.isLabIcon && suggestion.iconNode ? (
                              <Icon 
                                iconNode={suggestion.iconNode} 
                                className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" 
                              />
                            ) : suggestion.icon ? (
                              <suggestion.icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            ) : null}
                            {suggestion.text}
                          </motion.button>
                        ))}
                      </div>
                      
                      {/* First duplicate - repeat the same pattern */}
                      <div className="flex gap-2 py-1">
                        {[...suggestions.slice(6, 12), ...suggestions.slice(0, 6)].map((suggestion, index) => (
                          <motion.button
                            key={`dup1-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                            onClick={() => handleSampleQuery(suggestion.text)}
                          >
                            {suggestion.isLabIcon && suggestion.iconNode ? (
                              <Icon 
                                iconNode={suggestion.iconNode} 
                                className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" 
                              />
                            ) : suggestion.icon ? (
                              <suggestion.icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            ) : null}
                            {suggestion.text}
                          </motion.button>
                        ))}
                      </div>
                      
                      {/* Second duplicate */}
                      <div className="flex gap-2 py-1">
                        {[...suggestions.slice(6, 12), ...suggestions.slice(0, 6)].map((suggestion, index) => (
                          <motion.button
                            key={`dup2-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 transition-colors rounded-lg flex items-center group"
                            onClick={() => handleSampleQuery(suggestion.text)}
                          >
                            {suggestion.isLabIcon && suggestion.iconNode ? (
                              <Icon 
                                iconNode={suggestion.iconNode} 
                                className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" 
                              />
                            ) : suggestion.icon ? (
                              <suggestion.icon className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                            ) : null}
                            {suggestion.text}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="relative flex items-center">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <SportingbetDot size={16} />
              </div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre odds, times ou jogos do Mundial de Clubes da FIFA..."
                className="w-full h-12 pl-10 pr-12 rounded-lg bg-secondary/50 border-0"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}