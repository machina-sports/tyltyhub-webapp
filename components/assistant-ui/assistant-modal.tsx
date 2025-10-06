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
import { X, MessageSquare, Send, ExternalLink, ArrowDown } from "lucide-react";
import Image from "next/image";
import { createStreamingAdapterWithConfig } from "./streaming-adapter";
import { registerThread, getThreadHistory, saveMessageToThread } from "@/functions/thread-register";
import { useBrandTexts } from "@/hooks/use-brand-texts";

// Component to render object cards (events, matches, etc.)
function ObjectCards({ objects }: { objects: any[] }) {
  if (!objects || objects.length === 0) return null;

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
  assistantName
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  objectsMapRef: React.MutableRefObject<Map<string, any[]>>;
  objectsVersion: number;
  assistantName: string;
}) {
  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center"
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
              <Image
                src="/sb-logo.png"
                alt="Sportingbet Logo"
                width={24}
                height={24}
                className="rounded"
              />
              <h2 className="text-lg font-semibold">{assistantName}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Thread */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ThreadPrimitive.Root className="flex-1 flex flex-col overflow-hidden">
              <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4 space-y-4">
                <ThreadPrimitive.Messages
                  components={{
                    UserMessage: () => (
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
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
                      const objects = objectsMapRef.current.get(textContent) || [];

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
                    placeholder="Send a message..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <ComposerPrimitive.Send asChild>
                    <Button size="default" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
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
      />
    </AssistantRuntimeProvider>
  );
}

export function AssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string>("");
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Use ref to ensure thread registration only happens once (survives React StrictMode double-render)
  const threadRegistered = useRef(false);

  // Get assistant configuration
  const { name, welcomeMessage } = useAssistantConfig();

  // Register thread and load history
  useEffect(() => {
    if (!threadRegistered.current) {
      threadRegistered.current = true;

      console.log("📝 Registering new thread...");

      // Register thread in backend (with initial welcome message)
      registerThread({
        agentId: AGENT_CONFIG.agentId,
        userId: undefined,
        metadata: {
          source: "assistant-modal",
          created_from: "sportingbet-cwc"
        }
      }).then(async ({ error, threadId: newThreadId }: { error: boolean; threadId: string | null }) => {
        if (!error && newThreadId) {
          setThreadId(newThreadId);
          console.log("✅ Registered new thread in backend:", newThreadId);

          // Load history immediately after registration
          const { error: historyError, messages } = await getThreadHistory(newThreadId);

          if (!historyError && messages && messages.length > 0) {
            console.log("📚 Loaded thread history:", messages.length, "messages");

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
          }

          setIsReady(true);
        } else {
          console.error("❌ Failed to register thread");
          setIsReady(true);
        }
      }).catch((err: any) => {
        console.error("❌ Thread registration error:", err);
        threadRegistered.current = false;
        setIsReady(true);
      });
    }
  }, []);

  // Handle modal close - keep thread alive for same session
  const handleClose = () => {
    setIsOpen(false);
    // Thread persists - NOT cleared so same conversation continues on reopen
    // New thread only created on page refresh
  };

  // Don't render chat until thread is ready and messages are loaded
  if (!isReady || !threadId) {
    return (
      <>
        {/* Show chat bubble even during loading */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center"
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
      key={threadId} // Force remount when thread changes
      threadId={threadId}
      initialMessages={initialMessages}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={handleClose}
    />
  );
}
