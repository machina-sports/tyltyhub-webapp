"use client";

import { useState, ReactNode, useEffect, useRef } from 'react';
import { AssistantContext } from './context';
import { registerThread } from '@/functions/thread-register';

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const threadRegistered = useRef(false);

  // Register thread on mount
  useEffect(() => {
    if (!threadRegistered.current) {
      threadRegistered.current = true;
      
      registerThread({
        agentId: "assistant-thread-agent",
        userId: undefined,
        metadata: {
          source: "assistant-provider",
          created_from: "sportingbet-cwc"
        }
      }).then(({ error, threadId: newThreadId }) => {
        if (!error && newThreadId) {
          setThreadId(newThreadId);
        }
      }).catch((err) => {
        console.error("Failed to register thread:", err);
        threadRegistered.current = false;
      });
    }
  }, []);

  const openWithThread = (id: string) => {
    setThreadId(id);
    setIsOpen(true);
  };

  return (
    <AssistantContext.Provider
      value={{
        threadId,
        isOpen,
        setThreadId,
        setIsOpen,
        openWithThread,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}
