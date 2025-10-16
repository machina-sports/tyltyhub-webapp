"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
  useMessage,
} from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Send, ExternalLink, ArrowDown, Maximize2, Sparkles, User } from "lucide-react";
import Image from "next/image";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useBrandConfig } from "@/contexts/brand-context";
import { useRouter, usePathname } from "next/navigation";
import { createStreamingAdapterWithConfig } from "./streaming-adapter";
import { registerThread, getThreadHistory, saveMessageToThread } from "@/functions/thread-register";
import { useBrandTexts } from "@/hooks/use-brand-texts";
import { useAssistant } from "@/providers/assistant/use-assistant";
import { BettingRecommendationsWidget } from "@/components/betting-recommendations-widget";

// Component to render object cards (events, matches, etc.)
function ObjectCards({ objects }: { objects: any[] }) {
  if (!objects || !Array.isArray(objects) || objects.length === 0) return null;

  // Helper to format date/time nicely
  const formatDateTime = (obj: any) => {
    // Try different possible date fields
    const dateStr = obj.startDate || obj["sport:startDate"] || obj.date || obj["schema:startDate"];

    if (!dateStr) return null;

    try {
      const date = new Date(dateStr);
      // Format: "Oct 5, 2025 at 3:00 PM"
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

  // Helper to extract competition and venue
  const getCompetitionAndVenue = (obj: any) => {
    const competition = obj.competition || obj["sport:competition"]?.name || obj["schema:eventSchedule"]?.name;

    // Try multiple venue field variations
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

  // Helper to extract team names
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

        // Get status and scores
        const status = obj["sport:status"] || obj.status || 'not_started';
        const showScore = ["live", "ended", "finished", "closed", "completed", "in_progress", "interrupted"].includes(status?.toLowerCase());
        const homeScore = obj["sport:score"]?.["sport:homeScore"] || 0;
        const awayScore = obj["sport:score"]?.["sport:awayScore"] || 0;

        // Get team names
        const teams = getTeamNames(obj);

        // Only create clickable link if id exists
        if (!obj.id) {
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border rounded-lg opacity-50"
            >
              <div className="flex-1">
                {/* Competition • Venue */}
                {(competition || venue) && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {competition && <span>{competition}</span>}
                    {competition && venue && <span className="mx-1">•</span>}
                    {venue && <span>{venue}</span>}
                  </p>
                )}
                {/* Event name or Team scores */}
                {showScore && teams ? (
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{homeScore} {teams.home}</p>
                    <p className="font-medium text-sm">{awayScore} {teams.away}</p>
                  </div>
                ) : (
                  <p className="font-medium text-sm">{name}</p>
                )}
                {/* Date/Time */}
                {dateTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dateTime}
                  </p>
                )}
              </div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="flex-1">
              {/* Competition • Venue */}
              {(competition || venue) && (
                <p className="text-xs text-muted-foreground mb-1">
                  {competition && <span>{competition}</span>}
                  {competition && venue && <span className="mx-1">•</span>}
                  {venue && <span>{venue}</span>}
                </p>
              )}
              {/* Event name or Team scores */}
              {showScore && teams ? (
                <div className="space-y-1">
                  <p className="font-medium text-sm">{homeScore} {teams.home}</p>
                  <p className="font-medium text-sm">{awayScore} {teams.away}</p>
                </div>
              ) : (
                <p className="font-medium text-sm">{name}</p>
              )}
              {/* Date/Time */}
              {dateTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  {dateTime}
                </p>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground ml-2 flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

function AssistantModalContent({
  isOpen,
  setIsOpen,
  onClose,
  objectsMapRef,
  suggestionsMapRef,
  objectsVersion,
  assistantName,
  threadId,
  composerRef
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  objectsMapRef: React.MutableRefObject<Map<string, any[]>>;
  suggestionsMapRef: React.MutableRefObject<Map<string, string[]>>;
  objectsVersion: number;
  assistantName: string;
  threadId: string;
  composerRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const router = useRouter();
  const brand = useBrandConfig();
  const isSportingbet = brand.id === "sportingbet";
  const { chat } = useBrandTexts();
  const assistantPlaceholder = (chat as any).assistantPlaceholder || chat.placeholder;

  const handleExpand = () => {
    router.push(`/assistant/${threadId}`);
    onClose();
  };
  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`assistant-launcher hidden md:flex fixed bottom-[32px] right-8 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-200 items-center justify-center ${isSportingbet ? "bg-brand-secondary" : "bg-brand-primary"} text-white hover:brightness-95`}
          aria-label={`Open ${assistantName}`}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Modal Container */}
      {isOpen && (
        <div className="assistant-modal-container fixed bottom-4 right-4 z-50 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-background border rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <BrandLogo variant="icon" width={24} height={24} className="rounded" />
              <h2 className="text-lg font-semibold">{assistantName}</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="h-8 w-8 p-0"
                title="Expand to full page"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Thread */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ThreadPrimitive.Root className="flex-1 flex flex-col overflow-hidden">
              <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4 space-y-4">
                <ThreadPrimitive.Messages
                  components={{
                    UserMessage: () => (
                      <div className="flex justify-end gap-3 items-start w-full">
                        <div className="bg-primary text-white rounded-lg px-4 py-2 max-w-[80%] text-base font-sans">
                          <MessagePrimitive.Content />
                        </div>
                        {/* User Icon */}
                        <div className="flex-shrink-0 mt-2 bg-primary/20 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    ),
                    AssistantMessage: () => {
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
                          {/* Brand Icon - Hidden in modal to save space */}
                          
                          {/* Message Content */}
                          <div className="flex flex-col items-start flex-1">
                            <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%] border border-border text-base text-white font-sans">
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
                <ThreadPrimitive.ScrollToBottom className="absolute bottom-24 right-6">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full hover:bg-brand-primary/10 hover:border-brand-primary/60 mb-1">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </ThreadPrimitive.ScrollToBottom>
              </ThreadPrimitive.Viewport>

              <div className="border-t p-4">
                <ComposerPrimitive.Root className="flex gap-2 items-end">
                  <ComposerPrimitive.Input
                    ref={composerRef as any}
                    placeholder={assistantPlaceholder}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                <ComposerPrimitive.Send asChild>
                  <Button size="default" className="h-10 bg-brand-primary hover:brightness-95 text-white">
                    <Send className="h-5 w-5" />
                  </Button>
                </ComposerPrimitive.Send>
                </ComposerPrimitive.Root>
              </div>
            </ThreadPrimitive.Root>
          </div>
        </div>
      )}
    </>
  );
}

// Configuration - Update these values for your environment
const AGENT_CONFIG = {
  // Your agent ID or name from the backend
  agentId: "assistant-thread-agent",
  // Enable workflow-by-workflow streaming (shows progress as each workflow executes)
  streamWorkflows: true, // Set to true to see workflow progress + final message
};

function useAssistantConfig() {
  const { assistant } = useBrandTexts();

  return {
    name: assistant.name,
    welcomeMessage: assistant.welcomeMessage
  };
}

// Wrapper component to ensure runtime is only created after messages are loaded
function AssistantModalInner({
  threadId,
  initialMessages,
  rawMessages,
  isOpen,
  setIsOpen,
  onClose
}: {
  threadId: string;
  initialMessages: any[];
  rawMessages?: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
}) {
  // Map to store objects per message (keyed by message text to identify unique messages)
  const objectsMapRef = useRef<Map<string, any[]>>(new Map());
  const suggestionsMapRef = useRef<Map<string, string[]>>(new Map());
  const composerRef = useRef<HTMLTextAreaElement>(null);
  // Version counter to trigger re-renders when objects change
  const [objectsVersion, setObjectsVersion] = useState(0);

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

  // Get assistant configuration
  const { name, welcomeMessage } = useAssistantConfig();

  // Create adapter with thread ID and objects map
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

  // Create runtime with initial messages
  const runtime = useLocalRuntime(
    adapter,
    initialMessages.length > 0 ? { initialMessages } : undefined
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantModalContent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={onClose}
        objectsMapRef={objectsMapRef}
        suggestionsMapRef={suggestionsMapRef}
        objectsVersion={objectsVersion}
        assistantName={name}
        threadId={threadId}
        composerRef={composerRef}
      />
    </AssistantRuntimeProvider>
  );
}

// Custom hook to check if we should render the modal
function useShouldRenderModal() {
  const pathname = usePathname();
  return !pathname?.startsWith('/assistant/');
}

export function AssistantModal() {
  const { threadId: contextThreadId, isOpen, setIsOpen } = useAssistant();
  const pathname = usePathname();
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [rawMessages, setRawMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [lastLoadedThreadId, setLastLoadedThreadId] = useState<string>("");
  const brand = useBrandConfig();
  const isSportingbet = brand.id === "sportingbet";

  // Get assistant configuration
  const { name, welcomeMessage } = useAssistantConfig();

  // Check if we should render the modal
  const shouldRender = useShouldRenderModal();

  // Reload history when coming back to a page where modal should render
  useEffect(() => {
    if (!shouldRender) {
      // Reset when leaving the page
      setLastLoadedThreadId("");
      setIsReady(false);
      return;
    }
    
    // Reload history only if threadId changed
    if (contextThreadId && contextThreadId !== lastLoadedThreadId) {
      setLastLoadedThreadId(contextThreadId);
      setIsReady(false);

      // Load history for the thread
      getThreadHistory(contextThreadId).then(({ error: historyError, messages }) => {
        if (!historyError && messages && messages.length > 0) {
          // Store raw messages for objects/suggestions extraction
          setRawMessages(messages);
          
          // Convert backend messages to assistant-ui format
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
        } else {
          setRawMessages([]);
          setInitialMessages([]);
        }
        setIsReady(true);
      }).catch((err: any) => {
        console.error("Failed to load history:", err);
        setIsReady(true);
      });
    } else if (!contextThreadId) {
      // No thread yet, mark as ready
      setIsReady(true);
    }
  }, [contextThreadId, shouldRender, lastLoadedThreadId]);

  const threadId = contextThreadId || "";

  // Handle modal close - keep thread alive for same session
  const handleClose = () => {
    setIsOpen(false);
    // Thread persists - NOT cleared so same conversation continues on reopen
    // New thread only created on page refresh
  };

  // Early return after all hooks
  if (!shouldRender) {
    return null;
  }

  // Don't render chat until thread is ready and messages are loaded
  if (!isReady || !threadId) {
    return (
      <>
        {/* Show chat bubble even during loading */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className={`assistant-launcher hidden md:flex bottom-28 right-4 z-50 h-14 w-14 rounded-full ${isSportingbet ? "bg-brand-secondary" : "bg-brand-primary"} text-white shadow-lg hover:brightness-95 transition-all duration-200 items-center justify-center md:bottom-4 md:right-4`}
            aria-label="Open Chat Assistant"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}

        {/* Loading indicator when modal is opened before ready */}
        {isOpen && (
          <div className="assistant-modal-container fixed bottom-4 right-4 z-50 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-background border rounded-lg shadow-2xl flex items-center justify-center">
            <div className="text-muted-foreground">Loading chat...</div>
          </div>
        )}
      </>
    );
  }

  // Use key to ensure component remounts when switching threads
  return (
    <AssistantModalInner
      key={threadId} // Only remount when thread changes, not when messages are added
      threadId={threadId}
      initialMessages={initialMessages}
      rawMessages={rawMessages}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={handleClose}
    />
  );
}
