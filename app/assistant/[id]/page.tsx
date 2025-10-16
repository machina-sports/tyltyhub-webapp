"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { flushSync } from "react-dom";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
  useMessage,
} from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { Send, ExternalLink, ArrowDown, Minimize2, Sparkles, User } from "lucide-react";
import Image from "next/image";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createStreamingAdapterWithConfig } from "@/components/assistant-ui/streaming-adapter";
import { getThreadHistory } from "@/functions/thread-register";
import { useBrandTexts } from "@/hooks/use-brand-texts";
import { BettingRecommendationsWidget } from "@/components/betting-recommendations-widget";
import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive";
import { useAssistant } from "@/providers/assistant/use-assistant";

// Component to render object cards (events, matches, etc.)
function ObjectCards({ objects }: { objects: any[] }) {
  if (!objects || !Array.isArray(objects) || objects.length === 0) return null;

  const formatDateTime = (obj: any) => {
    const dateStr = obj.startDate || obj["sport:startDate"] || obj.date || obj["schema:startDate"];
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' at ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getCompetitionAndVenue = (obj: any) => {
    const competition = obj.competition || obj["sport:competition"]?.name || obj["schema:eventSchedule"]?.name;
    let venue = '';
    if (obj["sport:venue"]) {
      const venueName = obj["sport:venue"].name || '';
      const venueCity = obj["sport:venue"]["schema:addressLocality"] || '';
      venue = venueName ? `${venueName}${venueCity ? ', ' + venueCity : ''}` : '';
    } else {
      venue = obj.venue || obj["sport:location"]?.name || obj.location?.name || '';
    }
    return { competition, venue };
  };

  const getTeamNames = (obj: any) => {
    if (obj["sport:competitors"]) {
      const homeTeam = obj["sport:competitors"].find((c: any) => c["sport:qualifier"] === "home");
      const awayTeam = obj["sport:competitors"].find((c: any) => c["sport:qualifier"] === "away");
      return {
        home: homeTeam?.name || "",
        away: awayTeam?.name || ""
      };
    }
    return null;
  };

  return (
    <div className="mt-3 space-y-2">
      {objects.map((obj, idx) => {
        const name = obj.name || obj["@id"] || `Object ${idx + 1}`;
        const dateTime = formatDateTime(obj);
        const { competition, venue } = getCompetitionAndVenue(obj);
        const status = obj["sport:status"] || obj.status || 'not_started';
        const showScore = ["live", "ended", "finished", "closed", "completed", "in_progress", "interrupted"].includes(status?.toLowerCase());
        const homeScore = obj["sport:score"]?.["sport:homeScore"] || 0;
        const awayScore = obj["sport:score"]?.["sport:awayScore"] || 0;
        const teams = getTeamNames(obj);

        if (!obj.id) {
          return (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg opacity-50">
              <div className="flex-1">
                {(competition || venue) && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {competition && <span>{competition}</span>}
                    {competition && venue && <span className="mx-1">•</span>}
                    {venue && <span>{venue}</span>}
                  </p>
                )}
                {showScore && teams ? (
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{homeScore} {teams.home}</p>
                    <p className="font-medium text-sm">{awayScore} {teams.away}</p>
                  </div>
                ) : (
                  <p className="font-medium text-sm">{name}</p>
                )}
                {dateTime && <p className="text-xs text-muted-foreground mt-1">{dateTime}</p>}
              </div>
            </div>
          );
        }

        return (
          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors group">
            <div className="flex-1">
              {(competition || venue) && (
                <p className="text-xs text-muted-foreground mb-1">
                  {competition && <span>{competition}</span>}
                  {competition && venue && <span className="mx-1">•</span>}
                  {venue && <span>{venue}</span>}
                </p>
              )}
              {showScore && teams ? (
                <div className="space-y-1">
                  <p className="font-medium text-sm">{homeScore} {teams.home}</p>
                  <p className="font-medium text-sm">{awayScore} {teams.away}</p>
                </div>
              ) : (
                <p className="font-medium text-sm">{name}</p>
              )}
              {dateTime && <p className="text-xs text-muted-foreground mt-1">{dateTime}</p>}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground ml-2 flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

const AGENT_CONFIG = {
  agentId: "assistant-thread-agent",
  streamWorkflows: true,
};

function AssistantChatContent({
  threadId,
  initialMessages,
  initialQuery,
  rawMessages
}: {
  threadId: string;
  initialMessages: any[];
  initialQuery?: string;
  rawMessages?: any[];
}) {
  const router = useRouter();
  const { openWithThread } = useAssistant();
  const objectsMapRef = useRef<Map<string, any[]>>(new Map());
  const suggestionsMapRef = useRef<Map<string, string[]>>(new Map());
  const [objectsVersion, setObjectsVersion] = useState(0);
  const { chat } = useBrandTexts();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messageSent = useRef(false);

  // Populate refs from raw messages on mount
  useEffect(() => {
    if (rawMessages && rawMessages.length > 0) {
      rawMessages.forEach((msg: any) => {
        if (msg.role === 'assistant') {
          const textContent = typeof msg.content === 'string' ? msg.content : msg.content?.content || '';
          
          // Extract objects from document_content if available
          const docContent = msg.document_content?.[0];
          if (docContent) {
            if (docContent.objects && docContent.objects.length > 0) {
              objectsMapRef.current.set(textContent, docContent.objects);
            }
            if (docContent.suggestions && docContent.suggestions.length > 0) {
              suggestionsMapRef.current.set(textContent, docContent.suggestions);
            }
          } else {
            // Fallback to root level
            if (msg.objects && msg.objects.length > 0) {
              objectsMapRef.current.set(textContent, msg.objects);
            }
            if (msg.suggestions && msg.suggestions.length > 0) {
              suggestionsMapRef.current.set(textContent, msg.suggestions);
            }
          }
        }
      });
      setObjectsVersion(v => v + 1);
    }
  }, [rawMessages]);

  const handleMinimize = () => {
    // Use flushSync to ensure state update completes before navigation
    flushSync(() => {
      openWithThread(threadId);
    });
    router.push('/');
  };

  const adapter = useMemo(() => {
    return createStreamingAdapterWithConfig({
      agentId: AGENT_CONFIG.agentId,
      streamWorkflows: AGENT_CONFIG.streamWorkflows,
      threadId: threadId,
      objectsMapRef: objectsMapRef,
      suggestionsMapRef: suggestionsMapRef,
      onObjectsUpdate: () => {
        setObjectsVersion(v => v + 1);
      },
    });
  }, [threadId]);

  // Create runtime with initial messages - useLocalRuntime must be called unconditionally
  const runtime = useLocalRuntime(
    adapter,
    initialMessages.length > 0 ? { initialMessages } : undefined
  );

  // Send initial query after runtime is ready
  useEffect(() => {
    if (initialQuery && !messageSent.current && composerRef.current) {
      messageSent.current = true;
      
      // Remove the ?q parameter from URL to prevent re-submission on refresh
      router.replace(`/assistant/${threadId}`, { scroll: false });
      
      // Set the composer value and trigger submit
      const composer = composerRef.current;
      const form = composer.closest('form');
      
      // Simulate typing the message
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      
      if (nativeInputValueSetter && form) {
        nativeInputValueSetter.call(composer, initialQuery);
        const event = new Event('input', { bubbles: true });
        composer.dispatchEvent(event);
        
        // Submit the form after a small delay
        setTimeout(() => {
          form.requestSubmit();
        }, 100);
      }
    }
  }, [initialQuery, runtime, router, threadId]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
            <button 
              onClick={() => router.push('/')}
              className="cursor-pointer"
              aria-label="Go to home"
            >
              <BrandLogo variant="full" height={40} className="w-[200px] assistant-page-logo" />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="h-8 w-8 p-0 assistant-header-button"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ThreadPrimitive.Root className="flex-1 flex flex-col overflow-hidden">
            <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-4 space-y-4">
                <ThreadPrimitive.Messages
                  components={{
                    UserMessage: () => (
                      <div className="flex justify-end gap-3 items-start w-full">
                        <div className="bg-primary user-message-bubble rounded-lg px-4 py-3 max-w-[80%] text-[15px] font-sans">
                          <MessagePrimitive.Content />
                        </div>
                        {/* User Icon */}
                        <div className="flex-shrink-0 mt-1 bg-primary/20 p-2 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    ),
                    AssistantMessage: () => {
                      const message = useMessage();
                      const textContent = message.content
                        .filter((c: any) => c.type === "text")
                        .map((c: any) => c.text)
                        .join("");
                      const objectsData = objectsMapRef.current.get(textContent);
                      const objects = Array.isArray(objectsData) ? objectsData : [];
                      const suggestionsData = suggestionsMapRef.current.get(textContent);
                      const suggestions = Array.isArray(suggestionsData) ? suggestionsData : [];
                      
                      const markets = Array.isArray(objects)
                        ? objects.map((o: any) => {
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
                          {/* Brand Icon */}
                          <div className="flex-shrink-0 mt-2 bg-background rounded-lg">
                            <BrandLogo variant="icon" width={36} height={36} className="rounded" />
                          </div>
                          
                          {/* Message Content */}
                          <div className="flex flex-col items-start flex-1">
                            <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%] border border-border text-[15px] text-white font-sans">
                              <MessagePrimitive.Content />
                              {/* Temporarily hidden - will be reactivated later */}
                              {/* {objects && objects.length > 0 && markets.length === 0 && (
                                <ObjectCards objects={objects} />
                              )} */}
                            </div>
                            {markets && markets.length > 0 && (
                              <div className="mt-3 w-full">
                                <BettingRecommendationsWidget markets={markets as any} />
                              </div>
                            )}
                            {suggestions && suggestions.length > 0 && (
                              <div className="mt-3 space-y-2 w-auto">
                                {suggestions.map((suggestion: string, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-left bg-card border border-border rounded-lg hover:bg-brand-primary/10 hover:border-brand-primary/60 transition-colors w-auto"
                                  >
                                    <Sparkles className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="break-words">{suggestion}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    },
                  }}
                />
                <ThreadPrimitive.ScrollToBottom className="sticky bottom-8 ml-auto mr-4 md:hidden">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-lg hover:bg-brand-primary/10 hover:border-brand-primary/60">
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </ThreadPrimitive.ScrollToBottom>
                
                {/* Responsible Gaming Footer inside scroll area */}
                <div className="mt-8 pb-4">
                  <ResponsibleGamingResponsive />
                </div>
              </div>
            </ThreadPrimitive.Viewport>

            <div className="border-t bg-background">
              <div className="max-w-4xl mx-auto p-4">
                <ComposerPrimitive.Root className="flex gap-2 items-center">
                  <ComposerPrimitive.Input
                    ref={composerRef as any}
                    placeholder={chat.placeholder}
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden h-12 max-h-12 min-h-12"
                    rows={1}
                  />
                  <ComposerPrimitive.Send asChild>
                    <Button size="lg" className="h-12 px-6 bg-brand-primary hover:brightness-95 assistant-send-button shrink-0">
                      <Send className="h-5 w-5" />
                    </Button>
                  </ComposerPrimitive.Send>
                </ComposerPrimitive.Root>
              </div>
            </div>
          </ThreadPrimitive.Root>
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}

export default function AssistantChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const threadId = params.id as string;
  const initialQuery = searchParams.get('q');
  
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [rawMessages, setRawMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load thread history
  useEffect(() => {
    if (!threadId) return;

    getThreadHistory(threadId).then(({ error, messages }) => {
      if (!error && messages && messages.length > 0) {
        // Store raw messages for extracting objects/suggestions
        setRawMessages(messages);
        
        // Format messages for assistant-ui
        const formattedMessages = messages.map((msg: any) => ({
          role: msg.role as "user" | "assistant",
          content: [
            {
              type: "text" as const,
              text: typeof msg.content === 'string' ? msg.content : msg.content?.content || ''
            }
          ]
        }));
        setInitialMessages(formattedMessages);
      }
      setIsReady(true);
    }).catch(() => {
      setIsReady(true);
    });
  }, [threadId]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  // Use key to force remount only when thread changes
  return (
    <AssistantChatContent 
      key={threadId} 
      threadId={threadId} 
      initialMessages={initialMessages}
      rawMessages={rawMessages}
      initialQuery={initialQuery || undefined}
    />
  );
}

