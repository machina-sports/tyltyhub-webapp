"use client"

import { useState, useRef, useEffect } from "react"

import {
  Send,
  Reply,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation"

import { SportingbetDot } from "../ui/dot"

import { useGlobalState } from "@/store/useState"

import Image from "next/image"

import { motion } from "framer-motion"

import { useTheme } from "@/components/theme-provider"

import { cn } from "@/lib/utils"

const getImageUrl = (article: any): string => {
  if (!article) return '';

  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;

  if (article?.image_path) {
    return `${imageAddress}/${article?.image_path}`;
  }

  const title = article.title || 'Article';
  return `https://placehold.co/1200x600/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

const getEventType = (article: any): string => {
  if (!article || !article.metadata) return 'Notícias';

  // For soccer games, return "Futebol"
  if (article.metadata.event_type === 'soccer-game') {
    return 'Futebol';
  }

  // For competition names, make them more readable
  if (article.metadata.competition) {
    switch (article.metadata.competition) {
      case 'sr:competition:17':
        return 'Premier League';
      case 'sr:competition:384':
        return 'Libertadores';
      case 'sr:competition:390':
        return 'Brasileiro Série B';
      default:
        return article.metadata.competition;
    }
  }

  return 'Notícias';
};

const ContainerHome = ({ query }: { query: string }) => {
  const { isDarkMode } = useTheme() 

  const router = useRouter()

  const [input, setInput] = useState(query)

  const state = useGlobalState((state: any) => state.trending)

  const trendingArticle = state.trendingResults.data?.[0]?.value

  const topQuestions = trendingArticle?.related_questions || []

  const user_id = "123"

  // Random title options
  const titleOptions = [
    "Como posso entrar em campo para te ajudar hoje?",
    "Vamos jogar juntos? Me diz onde você precisa de reforço!",
    "Bola rolando! Em que jogada posso te ajudar?",
  ]

  // Get random title after client-side mount to avoid hydration errors
  const [randomTitle, setRandomTitle] = useState("Qual vai ser a sua aposta?")
  
  useEffect(() => {
    setRandomTitle(titleOptions[Math.floor(Math.random() * titleOptions.length)])
  }, [])

  // Animation states and refs for first row
  const [isFirstRowScrolling, setIsFirstRowScrolling] = useState(true)
  const firstRowRef = useRef<HTMLDivElement>(null)
  const firstRowContentRef = useRef<HTMLDivElement>(null)
  const firstRowPositionRef = useRef(0)
  const firstAnimationFrameIdRef = useRef<number | null>(null)

  // Animation states and refs for second row
  const [isSecondRowScrolling, setIsSecondRowScrolling] = useState(true)
  const secondRowRef = useRef<HTMLDivElement>(null)
  const secondRowContentRef = useRef<HTMLDivElement>(null)
  const secondRowPositionRef = useRef(0)
  const secondAnimationFrameIdRef = useRef<number | null>(null)

  // Animation effect for first row (LEFT TO RIGHT)
  useEffect(() => {
    const firstRowAnimation = () => {
      if (!isFirstRowScrolling || !firstRowRef.current || !firstRowContentRef.current) {
        return;
      }
      
      const contentWidth = firstRowContentRef.current.offsetWidth;
      firstRowPositionRef.current += 0.5;
      if (firstRowPositionRef.current >= contentWidth) {
        firstRowPositionRef.current = 0;
      }
      if (firstRowRef.current) { 
        firstRowRef.current.style.transform = `translateX(${-contentWidth + firstRowPositionRef.current}px)`;
      }
      
      firstAnimationFrameIdRef.current = requestAnimationFrame(firstRowAnimation);
    };
    
    if (isFirstRowScrolling) {
      if (firstAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(firstAnimationFrameIdRef.current);
      }
      firstAnimationFrameIdRef.current = requestAnimationFrame(firstRowAnimation);
    } else if (firstAnimationFrameIdRef.current !== null) {
      cancelAnimationFrame(firstAnimationFrameIdRef.current);
      firstAnimationFrameIdRef.current = null;
    }

    return () => {
      if (firstAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(firstAnimationFrameIdRef.current);
        firstAnimationFrameIdRef.current = null;
      }
    };
  }, [isFirstRowScrolling]);

  // Animation effect for second row (RIGHT TO LEFT)
  useEffect(() => {
    const secondRowAnimation = () => {
      if (!isSecondRowScrolling || !secondRowRef.current || !secondRowContentRef.current) {
        return;
      }
      
      const contentWidth = secondRowContentRef.current.offsetWidth;
      secondRowPositionRef.current += 0.5;
      if (secondRowPositionRef.current >= contentWidth) {
        secondRowPositionRef.current = 0;
      }
      
      if (secondRowRef.current) { 
        secondRowRef.current.style.transform = `translateX(${-secondRowPositionRef.current}px)`;
      }
      
      secondAnimationFrameIdRef.current = requestAnimationFrame(secondRowAnimation);
    };
    
    if (isSecondRowScrolling) {
      if (secondAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameIdRef.current);
      }
      secondAnimationFrameIdRef.current = requestAnimationFrame(secondRowAnimation);
    } else if (secondAnimationFrameIdRef.current !== null) {
      cancelAnimationFrame(secondAnimationFrameIdRef.current);
      secondAnimationFrameIdRef.current = null;
    }

    return () => {
      if (secondAnimationFrameIdRef.current !== null) {
        cancelAnimationFrame(secondAnimationFrameIdRef.current);
        secondAnimationFrameIdRef.current = null;
      }
    };
  }, [isSecondRowScrolling]);

  // Initialize positions
  useEffect(() => {
    if (firstRowContentRef.current && firstRowRef.current) {
      const width = firstRowContentRef.current.offsetWidth;
      firstRowPositionRef.current = 0; // Start positionRef at 0
      firstRowRef.current.style.transform = `translateX(${-width}px)`; // Initial transform for left-to-right
    }
    if (secondRowContentRef.current && secondRowRef.current) {
      secondRowPositionRef.current = 0; // Start positionRef at 0
      secondRowRef.current.style.transform = `translateX(0px)`; // Initial transform for right-to-left
    }
  }, []);

  // Hover handlers
  const pauseFirstRow = () => setIsFirstRowScrolling(false);
  const resumeFirstRow = () => setIsFirstRowScrolling(true);
  const pauseSecondRow = () => setIsSecondRowScrolling(false);
  const resumeSecondRow = () => setIsSecondRowScrolling(true);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!input.trim()) return

    router.push(`/chat/new?q=${encodeURIComponent(input)}&user_id=${user_id}`)
  }

  const handleSampleQuery = (text: string) => {
    setInput(text)
  }

  const getInputPlaceholder = () => {
    return "Busque por times, jogos ou odds..."
  }

  // Split questions into two groups
  const firstHalf = topQuestions?.slice(0, Math.ceil(topQuestions.length / 2)) || []
  const secondHalf = topQuestions?.slice(Math.ceil(topQuestions.length / 2)) || []

  return (
    <div className={cn(
      "flex flex-col h-screen pt-12 md:pt-0",
      isDarkMode ? "bg-[#061F3F]" : "bg-background"
    )}>
      <div className="flex-1 overflow-auto hide-scrollbar momentum-scroll pb-32 pt-4 md:pb-24">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
          <img className="w-full mb-10 max-w-[980px]" src="/980x250px_kv_-landing-page_chatbot.png" alt="logo" />
          <h1 className={cn(
            "text-center mb-4 sm:mb-6 flex items-center gap-3 justify-center",
            isDarkMode && "text-[#ffffff]"
          )}>
            {randomTitle}
            <SportingbetDot size={28} className={cn(
              "ml-1",
              isDarkMode && "text-[#45CAFF]"
            )} />
          </h1>
          <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className={cn(
                  "w-full h-12 pl-4 pr-12 rounded-lg",
                  isDarkMode ? "bg-[#061F3F] text-[#D3ECFF] placeholder:text-[#D3ECFF]/50 border border-[#45CAFF]/30 focus:border-[#45CAFF]/50 transition-colors" : "bg-secondary/50 border-0"
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "h-8 w-8",
                    isDarkMode && "text-[#45CAFF] hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
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
                <div className={cn(
                  "absolute left-0 top-0 h-full w-12 bg-gradient-to-r to-transparent z-10",
                  isDarkMode ? "from-[#061F3F]" : "from-background"
                )}></div>
                <div className={cn(
                  "absolute right-0 top-0 h-full w-12 bg-gradient-to-l to-transparent z-10",
                  isDarkMode ? "from-[#061F3F]" : "from-background"
                )}></div>
                <div className="flex overflow-hidden scrolling-row">
                  <div ref={firstRowRef} className="flex w-full touch-action-pan-y"> 
                    <div ref={firstRowContentRef} className="flex gap-2 py-1">
                      {firstHalf.map((text: string, index: number) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm transition-colors rounded-lg flex items-center group",
                            isDarkMode 
                              ? "text-[#D3ECFF]/60 hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10 active:bg-[#45CAFF]/20" 
                              : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60"
                          )}
                          onClick={() => handleSampleQuery(text)}
                        >
                          <Reply className={cn(
                            "h-4 w-4 mr-3 transition-colors",
                            isDarkMode 
                              ? "text-[#D3ECFF]/40 group-hover:text-[#D3ECFF]" 
                              : "text-muted-foreground/40 group-hover:text-muted-foreground"
                          )} />
                          {text}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex gap-2 py-1">
                      {firstHalf.map((text: string, index: number) => (
                        <motion.button
                          key={`dup1-${index}`}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm transition-colors rounded-lg flex items-center group",
                            isDarkMode 
                              ? "text-[#D3ECFF]/60 hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10 active:bg-[#45CAFF]/20" 
                              : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60"
                          )}
                          onClick={() => handleSampleQuery(text)}
                        >
                          <Reply className={cn(
                            "h-4 w-4 mr-3 transition-colors",
                            isDarkMode 
                              ? "text-[#D3ECFF]/40 group-hover:text-[#D3ECFF]" 
                              : "text-muted-foreground/40 group-hover:text-muted-foreground"
                          )} />
                          {text}
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
                <div className={cn(
                  "absolute left-0 top-0 h-full w-12 bg-gradient-to-r to-transparent z-10",
                  isDarkMode ? "from-[#061F3F]" : "from-background"
                )}></div>
                <div className={cn(
                  "absolute right-0 top-0 h-full w-12 bg-gradient-to-l to-transparent z-10",
                  isDarkMode ? "from-[#061F3F]" : "from-background"
                )}></div>
                <div className="flex overflow-hidden scrolling-row">
                  <div ref={secondRowRef} className="flex w-full touch-action-pan-y"> 
                    <div ref={secondRowContentRef} className="flex gap-2 py-1 transform">
                      {secondHalf.map((text: string, index: number) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm transition-colors rounded-lg flex items-center group",
                            isDarkMode 
                              ? "text-[#D3ECFF]/60 hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10 active:bg-[#45CAFF]/20" 
                              : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60"
                          )}
                          onClick={() => handleSampleQuery(text)}
                        >
                          <Reply className={cn(
                            "h-4 w-4 mr-3 transition-colors",
                            isDarkMode 
                              ? "text-[#D3ECFF]/40 group-hover:text-[#D3ECFF]" 
                              : "text-muted-foreground/40 group-hover:text-muted-foreground"
                          )} />
                          {text}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex gap-2 py-1">
                      {secondHalf.map((text: string, index: number) => (
                        <motion.button
                          key={`dup2-${index}`}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm transition-colors rounded-lg flex items-center group",
                            isDarkMode 
                              ? "text-[#D3ECFF]/60 hover:text-[#D3ECFF] hover:bg-[#45CAFF]/10 active:bg-[#45CAFF]/20" 
                              : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60"
                          )}
                          onClick={() => handleSampleQuery(text)}
                        >
                          <Reply className={cn(
                            "h-4 w-4 mr-3 transition-colors",
                            isDarkMode 
                              ? "text-[#D3ECFF]/40 group-hover:text-[#D3ECFF]" 
                              : "text-muted-foreground/40 group-hover:text-muted-foreground"
                          )} />
                          {text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContainerHome