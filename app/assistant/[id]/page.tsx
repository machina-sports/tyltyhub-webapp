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
import { Send, ExternalLink, ArrowDown, Minimize2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createStreamingAdapterWithConfig } from "@/components/assistant-ui/streaming-adapter";
import { getThreadHistory } from "@/functions/thread-register";
import { useBrandTexts } from "@/hooks/use-brand-texts";

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

function useAssistantConfig() {
  const { assistant } = useBrandTexts();
  return {
    name: assistant.name,
    welcomeMessage: assistant.welcomeMessage
  };
}

function AssistantChatContent({
  threadId,
  initialMessages,
  initialQuery
}: {
  threadId: string;
  initialMessages: any[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const objectsMapRef = useRef<Map<string, any[]>>(new Map());
  const [objectsVersion, setObjectsVersion] = useState(0);
  const { name } = useAssistantConfig();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messageSent = useRef(false);

  const handleMinimize = () => {
    router.back();
  };

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

  // Create runtime with initial messages - useLocalRuntime must be called unconditionally
  const runtime = useLocalRuntime(
    adapter,
    initialMessages.length > 0 ? { initialMessages } : undefined
  );

  // Send initial query after runtime is ready
  useEffect(() => {
    if (initialQuery && !messageSent.current && composerRef.current) {
      messageSent.current = true;
      
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
  }, [initialQuery, runtime]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <Image
              src="/sb-logo.png"
              alt="Sportingbet Logo"
              width={28}
              height={28}
              className="rounded"
            />
            <h1 className="text-xl font-semibold">{name}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="h-8 w-8 p-0"
            title="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ThreadPrimitive.Root className="flex-1 flex flex-col overflow-hidden">
            <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-4 space-y-4">
                <ThreadPrimitive.Messages
                  components={{
                    UserMessage: () => (
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 max-w-[80%]">
                          <MessagePrimitive.Content />
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

                      return (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
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
                <ThreadPrimitive.ScrollToBottom className="sticky bottom-4 ml-auto mr-4">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-lg">
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </ThreadPrimitive.ScrollToBottom>
              </div>
            </ThreadPrimitive.Viewport>

            <div className="border-t bg-background">
              <div className="max-w-4xl mx-auto p-4">
                <ComposerPrimitive.Root className="flex gap-2 items-end">
                  <ComposerPrimitive.Input
                    ref={composerRef as any}
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={1}
                  />
                  <ComposerPrimitive.Send asChild>
                    <Button size="lg" className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
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
  const [isReady, setIsReady] = useState(false);

  // Load thread history
  useEffect(() => {
    if (!threadId) return;

    getThreadHistory(threadId).then(({ error, messages }) => {
      if (!error && messages && messages.length > 0) {
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

  // Use key to force remount when messages are loaded
  return (
    <AssistantChatContent 
      key={`${threadId}-${initialMessages.length}`} 
      threadId={threadId} 
      initialMessages={initialMessages}
      initialQuery={initialQuery || undefined}
    />
  );
}

