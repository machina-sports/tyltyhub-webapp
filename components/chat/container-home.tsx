"use client"

import { useState, useRef, useEffect } from "react"

import {
  Search,
  Reply,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation"

import { SportingbetDot } from "../ui/dot"

import { useGlobalState } from "@/store/useState"

import Image from "next/image"

import { motion } from "framer-motion"

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

  const router = useRouter()

  const [input, setInput] = useState(query)

  const state = useGlobalState((state: any) => state.trending)

  const trendingArticle = state.trendingResults.data?.[0]?.value

  const topQuestions = trendingArticle?.related_questions || []

  const user_id = "123"

  // Animation states and refs
  const [isRowScrolling, setIsRowScrolling] = useState(true)
  const rowRef = useRef<HTMLDivElement>(null)
  const rowContentRef = useRef<HTMLDivElement>(null)
  const rowPositionRef = useRef(0)
  const animationFrameIdRef = useRef<number | null>(null)

  // Animation effect
  useEffect(() => {
    const rowAnimation = () => {
      if (!isRowScrolling || !rowRef.current || !rowContentRef.current) {
        return;
      }
      
      rowPositionRef.current += 0.5;
      const contentWidth = rowContentRef.current.offsetWidth;
      if (rowPositionRef.current >= contentWidth) {
        rowPositionRef.current = 0;
      }
      if (rowRef.current) { 
        rowRef.current.style.transform = `translateX(-${rowPositionRef.current}px)`;
      }
      
      animationFrameIdRef.current = requestAnimationFrame(rowAnimation);
    };
    
    if (isRowScrolling) {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      animationFrameIdRef.current = requestAnimationFrame(rowAnimation);
    } else if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isRowScrolling]);

  // Hover handlers
  const pauseRow = () => setIsRowScrolling(false);
  const resumeRow = () => setIsRowScrolling(true);

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

  return (
    <div className="flex flex-col h-screen bg-background pt-12 md:pt-0">
      <div className="flex-1 overflow-auto hide-scrollbar momentum-scroll pb-32 pt-4 md:pb-24">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
          {trendingArticle?.image_path && (
            <div className="relative w-full overflow-hidden rounded-lg aspect-[12/9] max-w-[520px] mb-8">
              <Image
                src={getImageUrl(trendingArticle)}
                alt={trendingArticle?.title}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
                loading="eager"
              />
            </div>
          )}
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
            <div 
              className="relative overflow-hidden rounded-lg"
              onMouseEnter={pauseRow}
              onMouseLeave={resumeRow}
              onTouchStart={pauseRow}
              onTouchEnd={resumeRow}
            >
              <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
              <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
              <div className="flex overflow-hidden scrolling-row">
                <div ref={rowRef} className="flex w-full touch-action-pan-y"> 
                  <div ref={rowContentRef} className="flex gap-2 py-1">
                    {topQuestions?.map((text: string, index: number) => (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.97 }}
                        className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
                        onClick={() => handleSampleQuery(text)}
                      >
                        <Reply className="h-4 w-4 mr-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                        {text}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex gap-2 py-1">
                    {topQuestions?.map((text: string, index: number) => (
                      <motion.button
                        key={`dup-${index}`}
                        whileTap={{ scale: 0.97 }}
                        className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
                        onClick={() => handleSampleQuery(text)}
                      >
                        <Reply className="h-4 w-4 mr-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
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
  )
}

export default ContainerHome