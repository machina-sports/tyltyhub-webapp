"use client";

import { useState, ReactNode } from 'react';
import { AssistantContext } from './context';

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
