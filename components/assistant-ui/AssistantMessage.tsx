"use client";

import { useEffect } from "react";
import { useMessage } from "@assistant-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { BettingRecommendationsWidget } from "@/components/betting-recommendations-widget";
import { ArticleRecommendationWidget } from "@/components/article-recommendation-widget";
import { MarkdownChat } from "@/components/markdown-content";
import { SuggestionsWidget } from "./SuggestionsWidget";

interface AssistantMessageProps {
  objectsMapRef: React.MutableRefObject<Map<string, any[]>>;
  suggestionsMapRef: React.MutableRefObject<Map<string, string[]>>;
  animatedWidgetsRef: React.MutableRefObject<Set<string>>;
  composerRef: React.RefObject<HTMLTextAreaElement>;
}

export function AssistantMessage({
  objectsMapRef,
  suggestionsMapRef,
  animatedWidgetsRef,
  composerRef,
}: AssistantMessageProps) {
  const message = useMessage();
  
  // Get text content to use as key
  const textContent = message.content
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join("");

  // Look up objects and suggestions for this specific message
  const objectsData = objectsMapRef.current.get(textContent);
  const objects = Array.isArray(objectsData) ? objectsData : [];
  const suggestionsData = suggestionsMapRef.current.get(textContent);
  const suggestions = Array.isArray(suggestionsData) ? suggestionsData : [];
  
  // Check if these specific widgets should animate
  const marketsKey = `markets-${textContent}`;
  const articlesKey = `articles-${textContent}`;
  const suggestionsKey = `suggestions-${textContent}`;
  
  // Extract articles and markets from objects
  const articles = Array.isArray(objects)
    ? objects
        .filter((o: any) => o?.article_id && o?.slug)
        .map((o: any) => ({
          article_id: o.article_id,
          image_path: o.image_path || '',
          title: o.title || '',
          subtitle: o.subtitle || '',
          slug: o.slug
        }))
    : [];
  
  const markets = Array.isArray(objects)
    ? objects
        .filter((o: any) => !o?.article_id) // Exclude articles from markets
        .map((o: any) => {
          const oddsValue = Number(
            (o && (o.price ?? o.bet_odd ?? o.odds ?? o.odd))
          );
          return {
            market_type: o?.market_type || o?.marketType || o?.market || 'odds_information',
            odds: oddsValue,
            rationale: o?.rationale || o?.reason || o?.description || '',
            title: o?.title || o?.bet_title || o?.market_title || o?.name || '',
            runner: o?.runner || o?.runner_name || o?.selection || o?.option_name || o?.name,
            event_id: o?.event_id || (o && o["event-id"]) || o?.fixture_id || o?.eventId,
            market_id: o?.market_id || (o && o["market-id"]) || o?.marketId,
            option_id: o?.option_id || (o && o["option-id"]) || o?.optionId,
            deep_link: o?.deep_link || o?.deepLink
          } as any;
        })
        .filter((m: any) => m.title && typeof m.odds === 'number' && !Number.isNaN(m.odds))
    : [];
  
  const shouldAnimateMarkets = !animatedWidgetsRef.current.has(marketsKey) && markets.length > 0;
  const shouldAnimateArticles = !animatedWidgetsRef.current.has(articlesKey) && articles.length > 0;
  const shouldAnimateSuggestions = !animatedWidgetsRef.current.has(suggestionsKey) && suggestions.length > 0;
  
  // Mark as animated AFTER mount using effect
  useEffect(() => {
    if (markets.length > 0) animatedWidgetsRef.current.add(marketsKey);
    if (articles.length > 0) animatedWidgetsRef.current.add(articlesKey);
    if (suggestions.length > 0) animatedWidgetsRef.current.add(suggestionsKey);
  }, [marketsKey, articlesKey, suggestionsKey, markets.length, articles.length, suggestions.length, animatedWidgetsRef]);

  const handleSuggestionClick = (suggestion: string) => {
    const composer = composerRef.current;
    if (!composer) return;
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(composer, suggestion);
      const event = new Event('input', { bubbles: true });
      composer.dispatchEvent(event);
      
      const form = composer.closest('form');
      if (form) {
        setTimeout(() => form.requestSubmit(), 50);
      }
    }
  };

  return (
    <div className="flex gap-3 items-start w-full">
      {/* Message Content */}
      <div className="flex flex-col items-start flex-1">
        <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%] border border-border text-[15px] text-white font-sans">
          <MarkdownChat content={textContent} />
        </div>
        
        <AnimatePresence mode="wait">
          {markets && markets.length > 0 && (
            <motion.div
              key={`betting-widget-${textContent}`}
              initial={shouldAnimateMarkets ? { opacity: 0, y: -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-3 w-full"
            >
              <BettingRecommendationsWidget markets={markets as any} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {articles && articles.length > 0 && (
            <motion.div
              key={`article-widget-${textContent}`}
              initial={shouldAnimateArticles ? { opacity: 0, y: -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-3 w-full"
            >
              <ArticleRecommendationWidget articles={articles as any} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <SuggestionsWidget 
          suggestions={suggestions}
          textContent={textContent}
          shouldAnimate={shouldAnimateSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </div>
  );
}

