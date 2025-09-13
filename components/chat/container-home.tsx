"use client"

import { useEffect, useRef, useState } from "react"

import {
  Reply,
  Send,
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
import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive"
import { useBrandTexts } from "@/hooks/use-brand-texts"
import { Loading } from "@/components/ui/loading"

import { Loader2 } from "lucide-react"
// import ScrollingRow from "./scrolling-row" // HIDDEN

const ContainerHome = ({ query }: { query: string }) => {
  const { isDarkMode } = useTheme()
  const { chat } = useBrandTexts()

  const router = useRouter()

  const [input, setInput] = useState(query)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null) // null means no selection, -1 means input is focused
  const [isSubmitting, setIsSubmitting] = useState(false)

  const state = useGlobalState((state: any) => state.trending)

  const trendingArticle = state.trendingResults.data?.[0]?.value
  const topQuestions = trendingArticle?.["trending-questions"] || []

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
    }, 400) // 300ms após o título aparecer

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(inputTimer)
    }
  }, [chat.titleOptions])

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

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= 0 && questionRefs.current[selectedIndex]) {
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

    setIsSubmitting(true)
    trackNewMessage(input)
    router.push(`/chat/new?q=${encodeURIComponent(input)}&user_id=${user_id}`)
    setIsSubmitting(false)
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

  return (
    <div className="flex flex-col" style={{
    }}>
      <div className="flex flex-col items-center p-6">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className={`text-bwin-neutral-100 text-center text-3xl sm:text-5xl font-bold leading-tight pt-4 pb-8 md:pt-12 md:pb-12 max-w-2xl mx-auto transition-all duration-300 ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {title}
          </h2>
        </div>
        <div className={`w-full max-w-xl mx-auto transition-all duration-300 ${isInputVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <form onSubmit={handleSubmit} className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chat.placeholder}
              className="w-full py-6 mb-5 pl-6 pr-14 rounded-2xl text-base text-white placeholder:text-neutral-60 focus:border-brand-primary focus:ring-0 transition-colors duration-200 home-input"
              disabled={isSubmitting}
              style={{
                backgroundColor: 'hsl(var(--bg-secondary))',
                borderColor: 'hsl(var(--border-primary))',
                WebkitAppearance: 'none',
                WebkitTapHighlightColor: 'transparent',
                fontSize: '16px' // Prevents zoom on iOS
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl text-neutral-0 transition-colors duration-200 disabled:opacity-50 home-send-button"
              style={{
                backgroundColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))'
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
            <div className="space-y-2 flex flex-col items-center -ml-6">
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
                      "w-fit max-w-full p-2 rounded-lg cursor-pointer transition-all duration-200",
                      selectedIndex === index
                        ? isDarkMode
                          ? "bg-brand-primary/10 border-2 border-brand-primary/50 shadow-sm"
                          : "bg-primary/10 border-2 border-primary/50 shadow-sm"
                        : isDarkMode
                          ? "hover:bg-brand-primary/5 border-2 border-transparent"
                          : "hover:bg-secondary/40 border-2 border-transparent"
                    )}
                    onClick={() => handleSampleQuery(question)}
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
        ) : null}
      </div>
    </div>

  )
}

export default ContainerHome