"use client"

import { Loader2, Reply, BarChart3, Newspaper, Gift, ChevronLeft, ChevronRight } from "lucide-react"

import { ChatBubble } from "./chat/bubble"

import { MarkdownChat } from "./markdown-content"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { trackRelatedQuestionClick } from "@/lib/analytics"
import { cn } from "@/lib/utils"

import { RelatedOdds } from "@/components/article/related-odds";
import { StandingsTable } from "@/components/discover/standings-table";
import { MatchCard, MatchesCalendar } from "@/components/discover/matches-calendar";
import { TeamsGrid } from "@/components/discover/teams-grid";
import { LiveMatchStatus } from "@/components/live-match-status";
import { WidgetCarousel } from "@/components/carousel/container";

interface ChatMessageProps {
  role: "user" | "assistant"
  content: any
  isTyping?: boolean
  onNewMessage?: any
  date?: string | null
}

export function ChatMessage({ role, content, date, isTyping, onNewMessage }: ChatMessageProps) {
  const [showWidget, setShowWidget] = useState(false)

  const currentMessage = content?.["question_answer"] || (typeof content === 'string' ? content : JSON.stringify(content))

  const relatedQuestions = content?.["related_questions"] || []

  const relatedArticle = content?.["related-article"]

  const hideWidgetOdds = ["finished", "cancelled", "ended"].includes(content?.["event_status"]?.["match_status"])

  const marketSelected = content?.["selected-markets"]

  const teamAwayAbbreviation = content?.["team_away_abbreviation"]
  const teamHomeAbbreviation = content?.["team_home_abbreviation"]
  const teamHomeName = content?.["team_home_name"]
  const teamAwayName = content?.["team_away_name"]
  const eventDateTime = content?.["event_datetime"]

  const eventStatus = content?.["event_status"]

  const promotion = content?.["promotion-image"] || content?.["promotion-link"] ? {
    image: content?.["promotion-image"],
    link: content?.["promotion-link"]
  } : null

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

  const haveSportsContext = content?.["sport_event"]

  // Handle both single widget and array of widgets
  const parsedWidgetContent = content?.["selected-widgets"]
  const widgetArray = useMemo(() => {
    const widgets = [];
    
    // Add LiveMatchStatus as first widget if eventStatus exists and status is "live"
    if (eventStatus && eventStatus.status === "live") {
      widgets.push({
        name: "Live Match Status",
        component: (
          <LiveMatchStatus 
            eventStatus={eventStatus}
            isDarkMode={true}
            teamHomeName={teamHomeName}
            teamAwayName={teamAwayName}
            teamHomeAbbreviation={teamHomeAbbreviation}
            teamAwayAbbreviation={teamAwayAbbreviation}
          />
        )
      });
    }
    
    // Add regular widgets
    if (parsedWidgetContent) {
      if (Array.isArray(parsedWidgetContent)) {
        widgets.push(...parsedWidgetContent.filter(widget => widget?.embed));
      } else if (parsedWidgetContent?.embed) {
        widgets.push(parsedWidgetContent);
      }
    }
    
    return widgets;
  }, [parsedWidgetContent, eventStatus, teamHomeName, teamAwayName, teamHomeAbbreviation, teamAwayAbbreviation]);

  return (
    <div className="mb-2 last:mb-0">
      <ChatBubble role={role}>
        <div className="space-y-2">
          {isTyping ? (
            <div className="flex items-center gap-2 text-bwin-neutral-60">
              <span className="text-sm">{content || "Pensando..."}</span>
              <img src="/soccer.gif" alt="Pensando..." className="w-6 h-6" />
            </div>
          ) : (
            <MarkdownChat content={currentMessage} />
          )}
        </div>
      </ChatBubble>

      {/* {marketSelected && (
        <div className="mt-4 pl-4 sm:pl-14">
          <div className="mt-2 space-y-2 text-sm text-bwin-neutral-60">
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
      )} */}

      {haveSportsContext && (
        <div className="mt-4 pl-4 ml-2 sm:pl-14 max-w-[320px]">
          <MatchCard
            fixture={{
              date: "",
              ko: haveSportsContext?.["start_time"] ? new Date(haveSportsContext["start_time"]).toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                weekday: 'short'
              }).replace(',', '').replace('.', '') : "",
              match: haveSportsContext?.["competitors"][0]?.["name"] + " x " + haveSportsContext?.["competitors"][1]?.["name"],
              venue: haveSportsContext?.["venue"]?.["name"],
              groupName: `Grupo ${haveSportsContext?.["sport_event_context"]?.["groups"]?.[0]?.["group_name"] || ""}`
            }}
            useAbbreviation={true}
            compact={true}
          />
        </div>
      )}

      {/* TESTE PROVISÓRIO - Componentes FIFA CWC */}
      {/* {role === "assistant" && (
        <div className="mt-6 pl-14">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-bwin-brand-primary">
                📊 Clasificación de los Grupos
              </h3>
              <StandingsTable />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-bwin-brand-primary">
                📅 Calendario de Partidos
              </h3>
              <MatchesCalendar 
                useAbbreviations={true} 
                compact={true} 
                maxMatches={6}
                maxWidth="500px"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-bwin-brand-primary">
                ⚽ Equipos Participantes
              </h3>
              <TeamsGrid />
            </div>
          </div>
        </div>
      )}
       */}

      {relatedArticle && relatedArticle.slug && (
        <div className="mt-0 pl-4 sm:pl-14">
          <div className="mt-2 ml-2 sm:ml-4">
            <Link
              href={`/discover/${relatedArticle.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors max-w-[420px] border overflow-hidden border-bwin-neutral-30 hover:border-bwin-brand-primary hover:bg-bwin-brand-primary/10"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-bwin-neutral-20 rounded-md overflow-hidden">
                {getRelatedArticleImageUrl(relatedArticle) ? (
                  <img
                    src={getRelatedArticleImageUrl(relatedArticle)}
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-bwin-neutral-60" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <h4 className="text-sm font-medium text-bwin-brand-primary line-clamp-2 leading-tight">
                  {relatedArticle.title}
                </h4>
                {relatedArticle.subtitle && (
                  <p className="text-xs text-bwin-neutral-60 mt-1 line-clamp-1">
                    {relatedArticle.subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>
      )}

      {promotion && (
        <div className="mt-0 pl-4 sm:pl-14">
          <div className="mt-2 ml-2 sm:ml-4">
            <a
              href={promotion.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg transition-colors max-w-[420px] border overflow-hidden border-bwin-neutral-30 hover:border-bwin-brand-primary hover:bg-bwin-brand-primary/10"
            >
              {getPromotionImageUrl(promotion.image) ? (
                <img
                  src={getPromotionImageUrl(promotion.image)}
                  alt="Promoción"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-bwin-neutral-20">
                  <Gift className="h-8 w-8 text-bwin-neutral-60" />
                </div>
              )}
            </a>
          </div>
        </div>
      )}

      {(widgetArray.length > 0) && !hideWidgetOdds && (
        <div className="mt-4 pl-4 sm:pl-[68px] max-w-[420px] dark">
          <WidgetCarousel widgets={widgetArray} isDarkMode={true} />
        </div>
      )}

      {relatedQuestions.length > 0 && (
        <div className="mt-4 pl-4 sm:pl-14">
          <div className="mt-2 space-y-2 text-sm text-bwin-neutral-60">
            {relatedQuestions.slice(0, 2).map((question: any, index: number) => (
              <div key={index} className="text-sm hover:underline cursor-pointer pr-2">
                <button
                  className="flex items-start gap-2 ml-2 sm:ml-4 text-left w-full bg-transparent border-none p-0 hover:underline break-words text-bwin-neutral-70 hover:text-bwin-neutral-100"
                  onClick={(e) => {
                    e.preventDefault()
                    trackRelatedQuestionClick(question)
                    onNewMessage(question)
                  }}
                >
                  <Reply className="h-4 w-4 flex-shrink-0 mt-1" />
                  <span className="break-words">{question}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {isRelatedBettingsEnabled && (
        <div className="mt-4 pl-14 ml-3">
          <div className="mt-2 space-y-2 text-md text-bwin-neutral-60">
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