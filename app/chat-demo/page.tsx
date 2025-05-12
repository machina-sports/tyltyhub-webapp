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
  const [isRecording, setIsRecording] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
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
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for the preparation timeout
  
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

    // --- Second Row Animation --- 
    const secondRowAnimation = () => {
      if (!isSecondRowScrolling || !secondRowRef.current || !secondRowContentRef.current) {
        return; // Stop if paused or refs are null
      }
      
      // For left-to-right scrolling (we need to initialize at negative position)
      secondRowPositionRef.current += 0.5; 
      const contentWidth = secondRowContentRef.current.offsetWidth;
      
      // Reset position when content has fully entered from the left
      if (secondRowPositionRef.current >= 0) {
        // If position has reached the end of first set, loop back
        if (secondRowPositionRef.current >= contentWidth) {
          secondRowPositionRef.current = -contentWidth;
        }
      }
      
      if (secondRowRef.current) { 
        secondRowRef.current.style.transform = `translateX(${secondRowPositionRef.current}px)`;
      }
      
      secondAnimationFrameIdRef.current = requestAnimationFrame(secondRowAnimation);
    };
    
    // Handle first row animation
    if (isFirstRowScrolling) {
      // Cancel any existing animation before starting a new one
      if (firstAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(firstAnimationFrameIdRef.current);
      }
      firstAnimationFrameIdRef.current = requestAnimationFrame(firstRowAnimation);
    } else if (firstAnimationFrameIdRef.current !== null) {
      cancelAnimationFrame(firstAnimationFrameIdRef.current);
      firstAnimationFrameIdRef.current = null;
    }
    
    // Handle second row animation
    if (isSecondRowScrolling) {
      // Cancel any existing animation before starting a new one
      if (secondAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameIdRef.current);
      }
      secondAnimationFrameIdRef.current = requestAnimationFrame(secondRowAnimation);
    } else if (secondAnimationFrameIdRef.current !== null) {
      cancelAnimationFrame(secondAnimationFrameIdRef.current);
      secondAnimationFrameIdRef.current = null;
    }

    // Cleanup: Cancel animation frames when component unmounts
    return () => {
      if (firstAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(firstAnimationFrameIdRef.current);
        firstAnimationFrameIdRef.current = null;
      }
      if (secondAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameIdRef.current);
        secondAnimationFrameIdRef.current = null;
      }
    };
  }, [isFirstRowScrolling, isSecondRowScrolling]); // Only depend on these two state variables

  // Initialize second row position when component mounts
  useEffect(() => {
    // Initialize second row at negative position to create illusion of infinite scroll
    if (secondRowContentRef.current && secondRowRef.current) {
      const width = secondRowContentRef.current.offsetWidth;
      secondRowPositionRef.current = -width; // Start completely off-screen to the left
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
            <h1 className="text-center mb-4 sm:mb-6 flex items-center gap-3 justify-center">
              Qual vai ser a sua aposta?
              <SportingbetDot size={28} className="ml-1" />
            </h1>
            <div className="w-full max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  className={cn(
                    "w-full h-10 md:h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0 shadow-sm text-base",
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
            <div className="mt-4 sm:mt-6 w-full max-w-xl mx-auto px-1">
              <div className="w-full relative flex flex-col gap-2 md:gap-3">
                <div 
                  className="relative overflow-hidden rounded-lg"
                  onMouseEnter={pauseFirstRow}
                  onMouseLeave={resumeFirstRow}
                  onTouchStart={pauseFirstRow}
                  onTouchEnd={resumeFirstRow}
                >
                  <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
                  <div className="flex overflow-hidden scrolling-row">
                    <div ref={firstRowRef} className="flex w-full touch-action-pan-y"> 
                      <div ref={firstRowContentRef} className="flex gap-2 py-1">
                        {suggestions.slice(0, 6).map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileTap={{ scale: 0.97 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
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
                            whileTap={{ scale: 0.97 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
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
                  className="relative overflow-hidden rounded-lg"
                  onMouseEnter={pauseSecondRow}
                  onMouseLeave={resumeSecondRow}
                  onTouchStart={pauseSecondRow}
                  onTouchEnd={resumeSecondRow}
                >
                  <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
                  <div className="flex overflow-hidden scrolling-row">
                    <div ref={secondRowRef} className="flex w-full touch-action-pan-y"> 
                      <div ref={secondRowContentRef} className="flex gap-2 py-1">
                        {suggestions.slice(6).map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileTap={{ scale: 0.97 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
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
                        {suggestions.slice(6).map((suggestion, index) => (
                          <motion.button
                            key={`dup2-${index}`}
                            whileTap={{ scale: 0.97 }}
                            className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
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