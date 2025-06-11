"use client"

import { Loader2, Reply, BarChart3, Newspaper, Gift } from "lucide-react"

import { ChatBubble } from "./chat/bubble"

import { MarkdownChat } from "./markdown-content"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { trackRelatedQuestionClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { useTheme } from '@/components/theme-provider'

import { RelatedOdds } from "@/components/article/related-odds";

interface ChatMessageProps {
  role: "user" | "assistant"
  content: any
  isTyping?: boolean
  onNewMessage?: any
  date?: string | null
}

// Add a memoized wrapper component
const WidgetEmbed = React.memo(({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} className="h-[200px]" />
))
WidgetEmbed.displayName = 'WidgetEmbed'

export function ChatMessage({ role, content, date, isTyping, onNewMessage }: ChatMessageProps) {
  const [showWidget, setShowWidget] = useState(false)
  const { isDarkMode } = useTheme();

  const currentMessage = content?.["question_answer"] || (typeof content === 'string' ? content : JSON.stringify(content))

  const relatedQuestions = content?.["related_questions"] || []

  const relatedBettings = content?.["related_bettings"] || []

  const isMatchFinished = content?.["is_match_finished"]

  const widgetMatchEmbed = content?.["widget-url"]

  const relatedArticle = content?.["related-article"]
  
  const marketSelected = content?.["market-selected"]

  const teamAwayAbbreviation = content?.["team_away_abbreviation"]
  const teamHomeAbbreviation = content?.["team_home_abbreviation"]
  const teamHomeName = content?.["team_home_name"]
  const teamAwayName = content?.["team_away_name"]
  const eventDateTime = content?.["event_datetime"]
  

  const promotion = content?.["promotion-image"] || content?.["promotion-link"] ? {
    image: content?.["promotion-image"],
    link: content?.["promotion-link"]
  } : null

  const isRelatedBettingsEnabled = content?.["related_betting_enabled"] && relatedBettings.length > 0

  // Helper function to get image URL for related article
  const getRelatedArticleImageUrl = (article: any): string => {
    if (!article) return '';

    const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;

    // Try different image path approaches
    if (article.image) {
      return article.image;
    }

    if (article.image_url) {
      return `${imageAddress}/${article.image_url}`;
    }

    if (article.value?.image_path) {
      return `${imageAddress}/${article.value.image_path}`;
    }

    // Try main image construction
    if (article.main_image_name && article._id && imageAddress) {
      return `${imageAddress}/article-image-id-${article._id}-${article.main_image_name}.png`;
    }

    if (article.value?.main_image_name && article._id && imageAddress) {
      return `${imageAddress}/article-image-id-${article._id}-${article.value.main_image_name}.png`;
    }

    return '';
  };

  // Helper function to get promotion image URL
  const getPromotionImageUrl = (promotionImage: any): string => {
    if (!promotionImage) return '';
    
    // Return the absolute URL directly
    if (typeof promotionImage === 'string') {
      return promotionImage;
    }
    
    return '';
  };

  const parsedWidgetContent = useMemo(() => {
    if (!widgetMatchEmbed) return null
    return typeof widgetMatchEmbed === 'string'
      ? JSON.parse(widgetMatchEmbed)?.[0]?.embed || widgetMatchEmbed
      : widgetMatchEmbed
  }, [widgetMatchEmbed])

  return (
    <div className="mb-2 last:mb-0">
      <ChatBubble role={role}>
        <div className="space-y-2">
          {isTyping ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">{content || "Pensando..."}</span>
              <img src="/soccer.gif" alt="Pensando..." className="w-6 h-6" />
            </div>
          ) : (
            currentMessage.split('\n').map((line: any, i: number) => (
              <React.Fragment key={i}>
                <MarkdownChat content={line} />
              </React.Fragment>
            ))
          )}
        </div>
      </ChatBubble>

      {marketSelected && (
        <div className="mt-4 pl-14">
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <div className="text-sm">
              <RelatedOdds 
                currentArticleId={marketSelected} 
                teamHomeAbbreviation={teamHomeAbbreviation}
                teamAwayAbbreviation={teamAwayAbbreviation}
                teamHomeName={teamHomeName}
                teamAwayName={teamAwayName}
                eventDateTime={eventDateTime}
              />
            </div>
          </div>
        </div>
      )}
      
      {relatedArticle && relatedArticle.slug && (
        <div className="mt-0 pl-14">
          <div className="mt-2 ml-4">
            <Link
              href={`/discover/${relatedArticle.slug}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors max-w-[420px] border",
                isDarkMode 
                  ? "border-[#45CAFF]/30 hover:border-[#45CAFF]/50 hover:bg-[#45CAFF]/10" 
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md overflow-hidden">
                {getRelatedArticleImageUrl(relatedArticle) ? (
                  <img
                    src={getRelatedArticleImageUrl(relatedArticle)}
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-primary line-clamp-2 leading-tight">
                  {relatedArticle.title}
                </h4>
                {relatedArticle.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {relatedArticle.subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>
      )}

      {promotion && (
        <div className="mt-0 pl-14">
          <div className="mt-2 ml-4">
            <a
              href={promotion.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block rounded-lg transition-colors max-w-[420px] border overflow-hidden",
                isDarkMode 
                  ? "border-[#45CAFF]/30 hover:border-[#45CAFF]/50 hover:bg-[#45CAFF]/10" 
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              {getPromotionImageUrl(promotion.image) ? (
                <img 
                  src={getPromotionImageUrl(promotion.image)}
                  alt="Promoção"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-muted">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </a>
          </div>
        </div>
      )}

      {relatedQuestions.length > 0 && (
        <div className="mt-4 pl-14">
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            {relatedQuestions.slice(0, 2).map((question: any, index: number) => (
              <div key={index} className="text-sm hover:underline cursor-pointer">
                <button
                  className="flex items-center gap-2 ml-4 text-left w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    trackRelatedQuestionClick(question)
                    onNewMessage(question)
                  }}
                >
                  <Reply className="h-4 w-4" />
                  {question}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {parsedWidgetContent && (
        <div className="mt-0 pl-14">
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <div className="text-sm hover:underline cursor-pointer">
              <button
                className="flex items-center gap-2 ml-4 text-left w-full"
                onClick={(e) => {
                  e.preventDefault()
                  setShowWidget(!showWidget)
                }}
              >
                <BarChart3 className="h-4 w-4" />
                {showWidget ? "Ocultar tabela de odds" : "Ver a tabela de odds da partida"}
              </button>
            </div>
          </div>

          {showWidget && (
            <div className="flex flex-col gap-2 mt-4 ml-4 w-[90%] md:w-[600px]">
              <WidgetEmbed content={parsedWidgetContent} />
            </div>
          )}
        </div>
      )}

      {/* {isRelatedBettingsEnabled && (
        <div className="mt-4 pl-14 ml-3">
          <div className="mt-2 space-y-2 text-md text-muted-foreground">
            {relatedBettings.slice(0, 3).map((bet: any, index: number) => (
              <BetBox key={index} bet={bet} />
            ))}
          </div>
        </div>
      )} */}

      {/* <RelatedArticles currentArticle="" /> */}
      <div className="h-2 md:hidden"></div>  {/*Adjust height as needed */}
    </div>
  )
}