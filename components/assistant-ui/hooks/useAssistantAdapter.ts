import { useMemo, useRef, useEffect } from "react";
import { createStreamingAdapterWithConfig } from "../streaming-adapter";

interface UseAssistantAdapterConfig {
  agentId: string;
  streamWorkflows: boolean;
  threadId: string;
  objectsMapRef: React.RefObject<Map<string, any[]>>;
  suggestionsMapRef: React.RefObject<Map<string, string[]>>;
  animatedWidgetsRef: React.RefObject<Set<string>>;
  onObjectsUpdate: () => void;
}

/**
 * Hook to create and manage the streaming adapter
 * Memoizes the adapter to prevent unnecessary re-creation
 */
export function useAssistantAdapter({
  agentId,
  streamWorkflows,
  threadId,
  objectsMapRef,
  suggestionsMapRef,
  animatedWidgetsRef,
  onObjectsUpdate,
}: UseAssistantAdapterConfig) {
  // Use ref to store the latest callback without triggering re-creation
  const onObjectsUpdateRef = useRef(onObjectsUpdate);
  
  useEffect(() => {
    onObjectsUpdateRef.current = onObjectsUpdate;
  }, [onObjectsUpdate]);

  const adapter = useMemo(() => {
    return createStreamingAdapterWithConfig({
      agentId,
      streamWorkflows,
      threadId,
      objectsMapRef: objectsMapRef as React.MutableRefObject<Map<string, any[]>>,
      suggestionsMapRef: suggestionsMapRef as React.MutableRefObject<Map<string, string[]>>,
      animatedWidgetsRef: animatedWidgetsRef as React.MutableRefObject<Set<string>>,
      onObjectsUpdate: () => onObjectsUpdateRef.current(),
    });
  }, [threadId, agentId, streamWorkflows, objectsMapRef, suggestionsMapRef, animatedWidgetsRef]);

  return adapter;
}

