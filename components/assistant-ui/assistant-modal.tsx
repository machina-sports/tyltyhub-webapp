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
import { X, MessageSquare, Send, ExternalLink, ArrowDown, Maximize2 } from "lucide-react";
import Image from "next/image";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useBrandConfig } from "@/contexts/brand-context";
import { useRouter, usePathname } from "next/navigation";
import { createStreamingAdapterWithConfig } from "./streaming-adapter";
import { registerThread, getThreadHistory, saveMessageToThread } from "@/functions/thread-register";
import { useBrandTexts } from "@/hooks/use-brand-texts";
import { useAssistant } from "@/providers/assistant/use-assistant";

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
  objectsVersion,
  assistantName,
  threadId
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  objectsMapRef: React.MutableRefObject<Map<string, any[]>>;
  objectsVersion: number;
  assistantName: string;
  threadId: string;
}) {
  const router = useRouter();
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
          className="hidden md:flex fixed bottom-28 right-4 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-200 items-center justify-center bg-brand-primary text-black hover:brightness-95 md:bottom-4"
          aria-label={`Open ${assistantName}`}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Modal Container */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-background border rounded-lg shadow-2xl flex flex-col">
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
                      <div className="flex justify-end">
                        <div className="bg-primary text-black rounded-lg px-4 py-2 max-w-[80%]">
                          <MessagePrimitive.Content />
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

                      // Look up objects for this specific message
                      const objectsData = objectsMapRef.current.get(textContent);
                      const objects = Array.isArray(objectsData) ? objectsData : [];

                      return (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                            <MessagePrimitive.Content />
                            {objects && objects.length > 0 && (
                              <ObjectCards objects={objects} />
                            )}
                          </div>
                        </div>
                      );
                    },
                  }}
                />
                <ThreadPrimitive.ScrollToBottom className="absolute bottom-20 right-6">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </ThreadPrimitive.ScrollToBottom>
              </ThreadPrimitive.Viewport>

              <div className="border-t p-4">
                <ComposerPrimitive.Root className="flex gap-2 items-end">
                  <ComposerPrimitive.Input
                    placeholder={assistantPlaceholder}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                <ComposerPrimitive.Send asChild>
                  <Button size="default" className="h-10 bg-brand-primary hover:brightness-95 text-black">
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
  isOpen,
  setIsOpen,
  onClose
}: {
  threadId: string;
  initialMessages: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
}) {
  // Map to store objects per message (keyed by message text to identify unique messages)
  const objectsMapRef = useRef<Map<string, any[]>>(new Map());
  // Version counter to trigger re-renders when objects change
  const [objectsVersion, setObjectsVersion] = useState(0);

  // Get assistant configuration
  const { name, welcomeMessage } = useAssistantConfig();

  // Create adapter with thread ID and objects map
  const adapter = useMemo(() => {
    return createStreamingAdapterWithConfig({
      agentId: AGENT_CONFIG.agentId,
      streamWorkflows: AGENT_CONFIG.streamWorkflows,
      threadId: threadId,
      objectsMapRef: objectsMapRef,
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
        objectsVersion={objectsVersion}
        assistantName={name}
        threadId={threadId}
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
  const { threadId: contextThreadId } = useAssistant();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [lastLoadedThreadId, setLastLoadedThreadId] = useState<string>("");

  // Get assistant configuration
  const { name, welcomeMessage } = useAssistantConfig();

  // Check if we should render the modal
  const shouldRender = useShouldRenderModal();

  // Reload history when coming back to a page where modal should render
  useEffect(() => {
    if (!shouldRender) {
      // Reset when leaving the page
      setLastLoadedThreadId("");
      return;
    }
    
    // Reload history if threadId exists and we haven't loaded this thread yet
    if (contextThreadId && (contextThreadId !== lastLoadedThreadId || !isReady)) {
      setLastLoadedThreadId(contextThreadId);
      setIsReady(false);

      // Load history for the thread
      getThreadHistory(contextThreadId).then(({ error: historyError, messages }) => {
        if (!historyError && messages && messages.length > 0) {
          // Convert backend messages to assistant-ui format
          const formattedMessages = messages.map((msg: any) => ({
            role: msg.role as "user" | "assistant",
            content: [
              {
                type: "text" as const,
                text: msg.content
              }
            ]
          }));

          setInitialMessages(formattedMessages);
        } else {
          setInitialMessages([]);
        }
        setIsReady(true);
      }).catch((err: any) => {
        console.error("Failed to load history:", err);
        setIsReady(true);
      });
    } else if (contextThreadId && !isReady) {
      setIsReady(true);
    }
  }, [contextThreadId, shouldRender, pathname]);

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
            className="hidden md:flex bottom-28 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 items-center justify-center md:bottom-4 md:right-4"
            aria-label="Open Chat Assistant"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}

        {/* Loading indicator when modal is opened before ready */}
        {isOpen && (
          <div className="fixed bottom-4 right-4 z-50 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-background border rounded-lg shadow-2xl flex items-center justify-center">
            <div className="text-muted-foreground">Loading chat...</div>
          </div>
        )}
      </>
    );
  }

  // Use key to ensure component remounts with correct initial messages
  return (
    <AssistantModalInner
      key={`${threadId}-${initialMessages.length}`} // Force remount when thread or messages change
      threadId={threadId}
      initialMessages={initialMessages}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={handleClose}
    />
  );
}
