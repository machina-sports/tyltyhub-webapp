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

import { motion } from "framer-motion"

import { useTheme } from "@/components/theme-provider"

import { cn } from "@/lib/utils"

import { trackNewMessage, trackSuggestedQuestionClick } from "@/lib/analytics"

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
  const [selectedIndex, setSelectedIndex] = useState(-1) // -1 means input is focused

  const state = useGlobalState((state: any) => state.trending)

  const trendingArticle = state.trendingResults.data?.[0]?.value

  const topQuestions = trendingArticle?.["trending-questions"] || []

  const user_id = "123"

  // Random title options
  const titleOptions = [
    "Como posso entrar em campo para te ajudar hoje?",
    "Vamos jogar? Me diz onde você precisa de reforço!",
    "Bola rolando! Em que jogada posso te ajudar?",
  ]

  // Get random title after client-side mount to avoid hydration errors
  const [randomTitle, setRandomTitle] = useState("Qual vai ser a sua aposta?")
  
  const inputRef = useRef<HTMLInputElement>(null)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setRandomTitle(titleOptions[Math.floor(Math.random() * titleOptions.length)])
  }, [])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectedIndex >= 0 && questionRefs.current[selectedIndex]) {
      questionRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    } else if (selectedIndex === -1 && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        setTimeout(() => {
          inputRef.current?.focus()
        }, 200)
      }, 100)
    }
  }, [selectedIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = prev + 1
          if (newIndex >= topQuestions.length) return 0
          return newIndex
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = prev - 1
          if (newIndex < -1) return topQuestions.length - 1
          return newIndex
        })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSampleQuery(topQuestions[selectedIndex])
        } else if (input.trim()) {
          handleSubmit(e as any)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedIndex(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, input, topQuestions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    trackNewMessage(input)
    router.push(`/chat/new?q=${encodeURIComponent(input)}&user_id=${user_id}`)
  }

  const handleSampleQuery = (text: string) => {
    trackSuggestedQuestionClick(text)
    setInput(text)
    setSelectedIndex(-1)
    // Don't submit immediately, just put in input field
    
    // Scroll to input on mobile after selecting a question
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        inputRef.current.focus()
      }
    }, 100)
  }

  const getInputPlaceholder = () => {
    return "Quais apostas você quer fazer?"
  }

  // Prevent scroll on mobile only for home page
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      // Store original body styles
      const originalBodyStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        height: document.body.style.height,
        width: document.body.style.width
      }

      // Apply mobile-specific styles
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.height = '100vh'
      document.body.style.width = '100%'

      // Cleanup function
      return () => {
        document.body.style.overflow = originalBodyStyle.overflow
        document.body.style.position = originalBodyStyle.position
        document.body.style.height = originalBodyStyle.height
        document.body.style.width = originalBodyStyle.width
      }
    }
  }, [])

  return (
    <div 
      className={cn(
        "flex flex-col h-[100vh] md:min-h-screen",
        isDarkMode ? "bg-[#061F3F]" : "bg-background"
      )}
      style={{
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar momentum-scroll pb-32 pt-4 md:pt-4 md:pb-24"
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex flex-col items-center p-4">
          <img className="w-full mb-0 max-w-[980px] mt-12 md:mt-0" src="/kv-txt-op1_980x250px_bot_.gif" alt="logo" />
          <h1 className={cn(
            "text-center mb-4 sm:mb-6 flex items-center gap-3 justify-center pt-10 pb-6 sm:pt-14 sm:pb-10",
            isDarkMode && "text-[#ffffff]"
          )}>
            {randomTitle}
          </h1>
          <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute left-3 top-[22px] -translate-y-1/2">
                <SportingbetDot size={20} className={cn(
                  isDarkMode && "text-[#45CAFF]"
                )} />
              </div>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className={cn(
                  "w-full h-12 pl-12 pr-12 rounded-lg",
                  selectedIndex === -1 && "ring-2 ring-primary/50",
                  isDarkMode ? "bg-[#051A35] text-[#D3ECFF] placeholder:text-[#D3ECFF]/50 border border-[#45CAFF]/30 focus:border-[#45CAFF]/50 transition-colors" : "bg-secondary border-0"
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
            
            {/* Navigation instruction - appears on both desktop and mobile */}
            {topQuestions.length > 0 && (
              <div className="mt-2 text-center hidden md:block">
                <p className={cn(
                  "text-xs",
                  isDarkMode ? "text-[#D3ECFF]/40" : "text-muted-foreground/60"
                )}>
                  Use ↑↓ para navegar • Enter para confirmar • Esc para o campo de busca
                </p>
              </div>
            )}
          </div>
          
          {/* Questions List */}
          {topQuestions.length > 0 && (
            <div className="mt-6 w-full max-w-xl mx-auto">
              <div className="space-y-2">
                {topQuestions.map((question: string, index: number) => (
                  <motion.div
                    key={index}
                    ref={(el) => { questionRefs.current[index] = el }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    {/* Icon indicator - outside hover area */}
                    <div className="flex-shrink-0 w-6 flex justify-center">
                      {selectedIndex === index ? (
                        <SportingbetDot 
                          size={20} 
                          className={cn(
                            "transition-all duration-200",
                            isDarkMode ? "text-[#45CAFF]" : "text-primary"
                          )} 
                        />
                      ) : (
                        <Reply 
                          className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            isDarkMode ? "text-[#D3ECFF]/40" : "text-muted-foreground/40"
                          )} 
                        />
                      )}
                    </div>
                    
                    {/* Text with hover - clickable area */}
                    <div
                      className={cn(
                        "flex-1 p-3 rounded-lg cursor-pointer transition-all duration-200",
                        selectedIndex === index
                          ? isDarkMode 
                            ? "bg-[#45CAFF]/10 border-2 border-[#45CAFF]/50 shadow-sm"
                            : "bg-primary/10 border-2 border-primary/50 shadow-sm"
                          : isDarkMode
                            ? "hover:bg-[#45CAFF]/5 border-2 border-transparent"
                            : "hover:bg-secondary/40 border-2 border-transparent"
                      )}
                      onClick={() => handleSampleQuery(question)}
                    >
                      <span className={cn(
                        "text-base transition-colors duration-200",
                        selectedIndex === index 
                          ? isDarkMode ? "text-[#D3ECFF]" : "text-foreground"
                          : isDarkMode ? "text-[#D3ECFF]/80" : "text-muted-foreground"
                      )}>
                        {question}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContainerHome