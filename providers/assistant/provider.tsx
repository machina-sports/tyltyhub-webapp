"use client";

import { useState, ReactNode, useEffect, useRef } from 'react';
import { AssistantContext } from './context';
import { registerThread } from '@/functions/thread-register';
import { getAgentId } from '@/lib/agent-config';
import { useBrandConfig } from '@/contexts/brand-context';

export function AssistantProvider({ children }: { children: ReactNode }) {
  const brand = useBrandConfig();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const threadRegistered = useRef(false);

  // Register thread on mount
  useEffect(() => {
    if (!threadRegistered.current) {
      threadRegistered.current = true;
      
      registerThread({
        agentId: getAgentId(brand.id),
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
  }, [brand.id]);

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
