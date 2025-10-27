import { useState, useEffect } from "react";
import { getThreadHistory } from "@/functions/thread-register";

interface FormattedMessage {
  role: "user" | "assistant";
  content: Array<{ type: "text"; text: string }>;
}

/**
 * Hook to load and manage thread history
 * @param threadId - The thread ID to load history for
 * @param shouldLoad - Whether to load the history
 * @returns Object containing initialMessages, rawMessages, and isReady flag
 */
export function useThreadHistory(threadId: string | undefined, shouldLoad: boolean) {
  const [initialMessages, setInitialMessages] = useState<FormattedMessage[]>([]);
  const [rawMessages, setRawMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [lastLoadedThreadId, setLastLoadedThreadId] = useState<string>("");

  useEffect(() => {
    if (!shouldLoad) {
      setLastLoadedThreadId("");
      setIsReady(false);
      return;
    }

    if (threadId && threadId !== lastLoadedThreadId) {
      setLastLoadedThreadId(threadId);
      setIsReady(false);

      getThreadHistory(threadId)
        .then(({ error: historyError, messages }) => {
          if (!historyError && messages && messages.length > 0) {
            // Store raw messages for objects/suggestions extraction
            setRawMessages(messages);
            
            // Convert backend messages to assistant-ui format
            const formattedMessages: FormattedMessage[] = messages.map((msg: any) => ({
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
        })
        .catch((err: any) => {
          console.error("Failed to load history:", err);
          setIsReady(true);
        });
    } else if (!threadId) {
      setIsReady(true);
    }
  }, [threadId, shouldLoad, lastLoadedThreadId]);

  return { initialMessages, rawMessages, isReady };
}

