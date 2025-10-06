import { createContext } from 'react';

export interface AssistantContextType {
  threadId: string | null;
  isOpen: boolean;
  setThreadId: (id: string | null) => void;
  setIsOpen: (open: boolean) => void;
  openWithThread: (threadId: string) => void;
}

export const AssistantContext = createContext<AssistantContextType | undefined>(undefined);
