"use client";

import { useMemo, useRef } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
} from "@assistant-ui/react";
import { MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useBrandConfig } from "@/contexts/brand-context";
import { useBrandTexts } from "@/hooks/use-brand-texts";
import { useAssistant } from "@/providers/assistant/use-assistant";
import { getAgentId } from "@/lib/agent-config";
import { useThreadHistory, useAssistantAdapter, useMessageRefs } from "./hooks";
import { ChatContent } from "./ChatContent";

// Configuration - Update these values for your environment
const AGENT_CONFIG = {
  // Enable workflow-by-workflow streaming (shows progress as each workflow executes)
  streamWorkflows: true,
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
  const router = useRouter();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  
  // Get assistant configuration
  const { name } = useAssistantConfig();
  const brand = useBrandConfig();

  // Initialize message refs and state
  const {
    objectsMapRef,
    suggestionsMapRef,
    animatedWidgetsRef,
    setObjectsVersion,
  } = useMessageRefs(rawMessages);

  // Create adapter with thread ID and objects map
  const adapter = useAssistantAdapter({
    agentId: getAgentId(brand.id),
    streamWorkflows: AGENT_CONFIG.streamWorkflows,
    threadId,
    objectsMapRef,
    suggestionsMapRef,
    animatedWidgetsRef,
    onObjectsUpdate: () => setObjectsVersion(v => v + 1),
  });

  // Create runtime with initial messages
  const runtime = useLocalRuntime(
    adapter,
    initialMessages.length > 0 ? { initialMessages } : undefined
  );

  const handleExpand = () => {
    router.push(`/assistant/${threadId}`);
    onClose();
  };

  const isSportingbet = brand.id === "sportingbet";

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`assistant-launcher hidden md:flex fixed bottom-[32px] right-8 z-50 h-[64px] w-[64px] rounded-full shadow-lg transition-all duration-200 items-center justify-center ${isSportingbet ? "bg-brand-secondary" : "bg-brand-primary"} text-white hover:brightness-95`}
          aria-label={`Open ${name}`}
        >
          <MessageSquare className="h-8 w-8" />
        </button>
      )}

      {/* Modal Container */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <AssistantRuntimeProvider runtime={runtime}>
            <ChatContent
              mode="modal"
              assistantName={name}
              objectsMapRef={objectsMapRef}
              suggestionsMapRef={suggestionsMapRef}
              animatedWidgetsRef={animatedWidgetsRef}
              onExpand={handleExpand}
              onClose={onClose}
            />
          </AssistantRuntimeProvider>
        </div>
      )}
    </>
  );
}

// Custom hook to check if we should render the modal
function useShouldRenderModal() {
  const pathname = usePathname();
  return !pathname?.startsWith('/assistant/');
}

export function AssistantModal() {
  const { threadId: contextThreadId, isOpen, setIsOpen } = useAssistant();
  const brand = useBrandConfig();
  const isSportingbet = brand.id === "sportingbet";

  // Get assistant configuration
  const { name } = useAssistantConfig();

  // Check if we should render the modal
  const shouldRender = useShouldRenderModal();

  // Load thread history
  const { initialMessages, rawMessages, isReady } = useThreadHistory(
    contextThreadId ?? undefined,
    shouldRender
  );

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
