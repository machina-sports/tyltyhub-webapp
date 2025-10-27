"use client";

import { useRef } from "react";
import {
  ThreadPrimitive,
  ComposerPrimitive,
} from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { Send, ArrowDown } from "lucide-react";
import { useBrandTexts } from "@/hooks/use-brand-texts";
import { ChatHeader } from "./ChatHeader";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";

interface ChatContentProps {
  mode: 'modal' | 'page';
  assistantName: string;
  objectsMapRef: React.MutableRefObject<Map<string, any[]>>;
  suggestionsMapRef: React.MutableRefObject<Map<string, string[]>>;
  animatedWidgetsRef: React.MutableRefObject<Set<string>>;
  onExpand?: () => void;
  onClose: () => void;
}

export function ChatContent({
  mode,
  assistantName,
  objectsMapRef,
  suggestionsMapRef,
  animatedWidgetsRef,
  onExpand,
  onClose,
}: ChatContentProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const { chat } = useBrandTexts();
  const assistantPlaceholder = (chat as any).assistantPlaceholder || chat.placeholder;

  // Container classes based on mode
  const containerClasses = mode === 'modal'
    ? "w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-background border rounded-lg shadow-2xl flex flex-col"
    : "flex flex-col h-screen bg-background";

  return (
    <div className={containerClasses}>
      <ChatHeader 
        assistantName={assistantName}
        onExpand={mode === 'modal' ? onExpand : undefined}
        onClose={onClose}
      />

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ThreadPrimitive.Root className="flex-1 flex flex-col overflow-hidden">
          <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4 space-y-4">
            <ThreadPrimitive.Messages
              components={{
                UserMessage: () => <UserMessage />,
                AssistantMessage: () => (
                  <AssistantMessage
                    objectsMapRef={objectsMapRef}
                    suggestionsMapRef={suggestionsMapRef}
                    animatedWidgetsRef={animatedWidgetsRef}
                    composerRef={composerRef}
                  />
                ),
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
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden"
              />
              <ComposerPrimitive.Send asChild>
                <Button size="default" className="h-10 bg-brand-primary hover:brightness-95 assistant-send-button">
                  <Send className="h-5 w-5" />
                </Button>
              </ComposerPrimitive.Send>
            </ComposerPrimitive.Root>
          </div>
        </ThreadPrimitive.Root>
      </div>
    </div>
  );
}

