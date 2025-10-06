"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"

import {
  Reply,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useRouter } from "next/navigation"

import { SportingbetDot } from "../ui/dot"

import { useGlobalState } from "@/store/useState"

import { motion } from "framer-motion"

import { useTheme } from "@/components/theme-provider"

import { cn } from "@/lib/utils"

import { trackNewMessage, trackSuggestedQuestionClick } from "@/lib/analytics"
import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive"
import { useBrandTexts } from "@/hooks/use-brand-texts"
import { Loading } from "@/components/ui/loading"
import { useAssistant } from "@/providers/assistant/use-assistant"
import { saveMessageToThread } from "@/functions/thread-register"

import { Loader2 } from "lucide-react"
// import ScrollingRow from "./scrolling-row" // HIDDEN

const ContainerHome = ({ query }: { query: string }) => {
  const { isDarkMode } = useTheme()
  const { chat } = useBrandTexts()
  const { threadId, openWithThread } = useAssistant()

  const router = useRouter()

  const [input, setInput] = useState(query)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null) // null means no selection, -1 means input is focused
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const state = useGlobalState((state: any) => state.trending)

  const trendingArticle = state.trendingResults.data?.[0]?.value
  const topQuestions = useMemo(() => 
    trendingArticle?.["trending-questions"] || [], 
    [trendingArticle]
  )

  // Only show loading if status is loading AND we don't have questions yet
  const isLoadingTrending = state.trendingResults.status === "loading" && topQuestions.length === 0

  const user_id = "123"

  const inputRef = useRef<HTMLInputElement>(null)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Random title with hidden approach
  const [title, setTitle] = useState("¿Cuál va a ser tu apuesta?")
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const [isInputVisible, setIsInputVisible] = useState(false)

  useEffect(() => {
    // Define o título random primeiro
    if (chat.titleOptions?.length > 0) {
      const randomTitle = chat.titleOptions[Math.floor(Math.random() * chat.titleOptions.length)]
      setTitle(randomTitle)
    }

    // Sequência de animações
    const titleTimer = setTimeout(() => {
      setIsTitleVisible(true)
    }, 100)

    const inputTimer = setTimeout(() => {
      setIsInputVisible(true)
      // Dispatch event when input animation completes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('homeAnimationsComplete'))
      }, 300) // Wait for input animation to complete
    }, 400) // 300ms após o título aparecer

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(inputTimer)
    }
  }, [chat.titleOptions])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsSubmitting(true)
    trackNewMessage(input)
    
    try {
      // Navigate to assistant page with the message as a query param
      // The assistant page will handle sending it and getting the response
      if (threadId) {
        router.push(`/assistant/${threadId}?q=${encodeURIComponent(input.trim())}`)
      } else {
        // Fallback: if no threadId yet, just open the modal
        openWithThread("")
      }
    } catch (error) {
      console.error("Error submitting message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [input, router, threadId, openWithThread])

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Focus input on mount to ensure it's visible on iOS
  useEffect(() => {
    if (inputRef.current) {
      // Small delay to ensure input is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  // Auto-scroll to selected item removed to prevent unwanted scrolling behavior
  useEffect(() => {
    if (selectedIndex === -1 && inputRef.current) {
      setTimeout(() => {
        // Only focus, no scrolling
        inputRef.current?.focus()
      }, 200)
    }
  }, [selectedIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const currentIndex = prev ?? -1
          const newIndex = currentIndex + 1
          if (newIndex >= topQuestions.length) return 0
          return newIndex
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => {
          const currentIndex = prev ?? -1
          const newIndex = currentIndex - 1
          if (newIndex < -1) return topQuestions.length - 1
          return newIndex
        })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex !== null && selectedIndex >= 0) {
          handleSampleQuery(topQuestions[selectedIndex], selectedIndex)
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
  }, [selectedIndex, input, topQuestions, handleSubmit])

  const handleSampleQuery = (text: string, index?: number) => {
    trackSuggestedQuestionClick(text)
    setInput(text)

    // Set selected index to show visual feedback when clicking
    if (index !== undefined) {
      setSelectedIndex(index)
      // After a brief moment, move to input
      setTimeout(() => {
        setSelectedIndex(-1)
      }, 150)
    } else {
      setSelectedIndex(-1)
    }

    // Focus input after selecting a question (scroll removed)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 200)
  }

  return (
    <div className="flex flex-col" style={{
    }}>
      <div className="flex-1 flex flex-col items-center py-6">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className={`text-bwin-neutral-100 text-center text-3xl sm:text-5xl font-bold leading-tight px-4 py-2 md:pt-12 md:pb-12 max-w-2xl mx-auto transition-all duration-300 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {title}
          </h2>
        </div>

        {/* Input sticky para mobile - na posição correta */}
        {isMobile && (
          <div className="w-full sticky top-[80px] pt-2 z-50 input-sticky-container">
            <div className={`transition-all duration-300 ${isInputVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <form onSubmit={handleSubmit} className="relative p-4">
              <Textarea
                ref={inputRef as any}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
                placeholder={chat.placeholder}
                className="w-full py-4 pl-6 pr-14 rounded-xl text-base text-white placeholder:text-neutral-80 focus:border-brand-primary focus:ring-0 transition-colors duration-200 home-input resize-none border-2"
                disabled={isSubmitting}
                rows={chat.mobileInputRows || 2}
                style={{
                  backgroundColor: 'hsl(var(--bg-secondary))',
                  borderColor: 'hsl(var(--border-primary))',
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  fontSize: '16px', // Prevents zoom on iOS
                  minHeight: chat.mobileInputRows === 1 ? '50px' : '60px',
                  maxHeight: chat.mobileInputRows === 1 ? '50px' : '82px'
                }}
              />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isSubmitting}
                  className="absolute right-8 h-8 w-8 rounded-xl text-white transition-colors duration-200 disabled:opacity-50 home-send-button send-button cursor-pointer top-1/2 -translate-y-1/2"
                  style={{
                    backgroundColor: 'hsl(var(--border))'
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        <div className={`w-full max-w-xl mx-auto transition-all duration-300 ${isInputVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isMobile ? 'hidden' : ''}`}>
          <form onSubmit={handleSubmit} className="relative">
            {isMobile ? (
              <Textarea
                ref={inputRef as any}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
                placeholder={chat.placeholder}
                className="w-full py-4 pl-6 pr-14 rounded-xl text-base text-white placeholder:text-neutral-60 focus:border-brand-primary focus:ring-0 transition-colors duration-200 home-input resize-none border-2"
                disabled={isSubmitting}
                rows={chat.mobileInputRows || 2}
                style={{
                  backgroundColor: 'hsl(var(--bg-secondary))',
                  borderColor: 'hsl(var(--border-primary))',
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  fontSize: '16px', // Prevents zoom on iOS
                  minHeight: chat.mobileInputRows === 1 ? '50px' : '60px',
                  maxHeight: chat.mobileInputRows === 1 ? '50px' : '82px'
                }}
              />
            ) : (
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chat.placeholder}
                className="w-full py-8 mb-5 pl-6 pr-14 rounded-2xl text-base text-white placeholder:text-neutral-60 focus:border-brand-primary focus:ring-0 transition-colors duration-200 home-input"
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'hsl(var(--bg-secondary))',
                  borderColor: 'hsl(var(--border-primary))',
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  fontSize: '16px' // Prevents zoom on iOS
                }}
              />
            )}
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSubmitting}
              className={cn(
                "absolute right-4 h-8 w-8 rounded-xl text-white transition-colors duration-200 disabled:opacity-50 home-send-button send-button cursor-pointer",
                isMobile
                  ? (chat.mobileInputRows === 1 ? "top-3" : "top-1/2 -translate-y-1/2")
                  : "top-1/2 -translate-y-1/2"
              )}
              style={{
                backgroundColor: 'hsl(var(--border))'
              }}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>

        {/* Sample questions with Spanish translations - HIDDEN */}
        {/* <div className="w-full max-w-4xl mx-auto mt-4">
          <ScrollingRow
            questions={[
              "¿Qué probabilidades tiene el Atlético de Madrid de ganar La Liga?",
              "¿Cómo puedo apostar en el próximo partido del Real Madrid?",
              "¿Cuáles son las mejores cuotas para el Barcelona en La Liga?",
              "¿Qué equipo de Madrid tiene más opciones en La Liga?",
              "¿Cuándo juega el Atlético de Madrid su próximo partido en La Liga?",
              "¿Cuáles son las cuotas para ganar La Liga?"
            ]}
            onSampleQuery={handleSampleQuery}
          />
        </div> */}

        {/* Questions List */}
        {isLoadingTrending ? (
          <div className="mt-6 w-full max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center min-h-[200px]">
              <Loading width={100} height={100} showLabel={true} label="Carregando perguntas..." />
            </div>
          </div>
        ) : topQuestions.length > 0 ? (
          <div className="mt-2 w-full max-w-4xl mx-auto px-4">
            <div className="space-y-2 flex flex-col md:items-center -ml-p[-20px] md:-ml-12">
              {topQuestions.map((question: string, index: number) => (
                <motion.div
                  key={index}
                  ref={(el) => { questionRefs.current[index] = el }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 w-fit"
                >
                  {/* Icon indicator - always show with opacity */}
                  <div className="flex-shrink-0 w-6 flex justify-center">
                    <SportingbetDot
                      size={20}
                      className={cn(
                        "transition-all duration-200",
                        selectedIndex === index
                          ? isDarkMode ? "text-brand-primary" : "text-[#FDBA12]"
                          : "opacity-10"
                      )}
                    />
                  </div>

                  {/* Text with hover - clickable area */}
                  <div
                    className={cn(
                      "w-fit max-w-full p-2 rounded-lg cursor-pointer transition-all duration-200 border-2",
                      selectedIndex === index
                        ? isDarkMode
                          ? "bg-brand-primary/15 border-brand-primary/60 shadow-md scale-[1.02]"
                          : "bg-primary/15 border-primary/60 shadow-md scale-[1.02]"
                        : isDarkMode
                          ? "hover:bg-brand-primary/8 hover:border-brand-primary/30 border-transparent hover:scale-[1.01]"
                          : "hover:bg-secondary/50 hover:border-secondary/60 border-transparent hover:scale-[1.01]"
                    )}
                    onClick={() => handleSampleQuery(question, index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onMouseLeave={() => setSelectedIndex(null)}
                  >
                    <span className={cn(
                      "text-base transition-colors duration-200",
                      selectedIndex === index
                        ? isDarkMode ? "text-white" : "text-foreground"
                        : isDarkMode ? "#FFF8E1" : "text-muted-foreground"
                    )}>
                      {question}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (state.trendingResults.status === "idle" || state.trendingResults.status === "failed") ? (
          <div className="mt-2 w-full max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center px-4 min-h-[100px]">
              <p className="text-muted-foreground text-center text-sm">
                {chat.noSuggestionsFound}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>

  )
}

export default ContainerHome