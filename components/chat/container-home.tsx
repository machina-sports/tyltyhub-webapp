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

import { Loader2 } from "lucide-react"
import ScrollingRow from "./scrolling-row"

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null) // null means no selection, -1 means input is focused
  const [isSubmitting, setIsSubmitting] = useState(false)

  const state = useGlobalState((state: any) => state.trending)

  const trendingArticle = state.trendingResults.data?.[0]?.value

  const topQuestions = trendingArticle?.["trending-questions"] || []

  const user_id = "123"

  // Random title options
  const titleOptions = [
    "¿Cómo puedo entrar al campo para ayudarte hoy?",
    "¿Vamos a jugar? ¡Dime dónde necesitas refuerzo!",
    "¡Balón en juego! ¿En qué jugada puedo ayudarte?",
  ]

  // Get random title after client-side mount to avoid hydration errors
  const [randomTitle, setRandomTitle] = useState("¿Cuál va a ser tu apuesta?")

  const inputRef = useRef<HTMLInputElement>(null)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setRandomTitle(titleOptions[Math.floor(Math.random() * titleOptions.length)])
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

  const getInputPlaceholder = () => {
    return "Converse com o Bwin BOT..."
  }

  // Improved mobile scroll handling for home page
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

      // Apply mobile-specific styles with better scroll handling
      document.body.style.overflow = 'auto'
      document.body.style.position = 'relative'
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
      className="flex flex-col md:min-h-screen bg-bwin-neutral-10 pt-12 pb-24 md:pb-0 md:pt-0"
      style={{
        overscrollBehavior: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="flex flex-col items-center p-4">
        {/* Main heading for SEO - visually hidden but accessible */}
        <h1 className="sr-only">La Inteligencia Artificial de bwin</h1>

        {/* Hero section without logo */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-bwin-neutral-100 text-center mb-8 text-3xl sm:text-5xl font-bold leading-tight animate-slide-up pt-8">
            {randomTitle}
          </h2>

        </div>

        {/* Enhanced chat input */}
        <div className="w-full max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntame sobre LaLiga..."
              className="w-full py-6 pl-6 pr-14 rounded-2xl bg-bwin-neutral-20 border-2 border-bwin-neutral-30 text-base text-bwin-neutral-100 placeholder:text-bwin-neutral-60 focus:border-bwin-brand-primary focus:ring-0 focus:bg-bwin-neutral-20 transition-colors duration-200"
              disabled={isSubmitting}
              style={{
                WebkitAppearance: 'none',
                WebkitTapHighlightColor: 'transparent',
                fontSize: '16px' // Prevents zoom on iOS
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-bwin-brand-primary hover:bg-bwin-brand-secondary text-bwin-neutral-0 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>

        {/* Sample questions with Spanish translations */}
        <div className="w-full max-w-4xl mx-auto mt-4">
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
                          isDarkMode ? "text-[#FFCB00]" : "text-[#FDBA12]"
                        )}
                      />
                    ) : (
                      <Reply
                        className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isDarkMode ? "text-gray-500" : "text-muted-foreground/40"
                        )}
                      />
                    )}
                  </div>

                  {/* Text with hover - clickable area */}
                  <div
                    className={cn(
                      "flex-1 p-2 rounded-lg cursor-pointer transition-all duration-200",
                      selectedIndex === index
                        ? isDarkMode
                          ? "bg-[#FFCB00]/10 border-2 border-[#FFCB00]/50 shadow-sm"
                          : "bg-primary/10 border-2 border-primary/50 shadow-sm"
                        : isDarkMode
                          ? "hover:bg-[#FFCB00]/5 border-2 border-transparent"
                          : "hover:bg-secondary/40 border-2 border-transparent"
                    )}
                    onClick={() => handleSampleQuery(question)}
                  >
                    <span className={cn(
                      "text-base transition-colors duration-200",
                      selectedIndex === index
                        ? isDarkMode ? "text-white" : "text-foreground"
                        : isDarkMode ? "text-gray-300" : "text-muted-foreground"
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
      {/* Responsible Gaming Footer */}
      <div className="flex justify-center w-full">
        <div className="mx-4 mt-12 pb-0 max-w-[976px] w-full">
          <ResponsibleGamingResponsive />
        </div>
      </div>
    </div>

  )
}

export default ContainerHome