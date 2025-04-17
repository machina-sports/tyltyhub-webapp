import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  oddsType?: string | null;
}

interface ChatState {
  messages: Message[];
  showInitial: boolean;
  isTyping: boolean;
  resetChat: () => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean) => void;
}

export const useChatState = create<ChatState>((set) => ({
  messages: [],
  showInitial: true,
  isTyping: false,
  resetChat: () => set({ messages: [], showInitial: true, isTyping: false }),
  setMessages: (messages: Message[]) => set({ messages }),
  addMessage: (message: Message) => set((state) => ({ 
    messages: [...state.messages, message],
    showInitial: false
  })),
  setIsTyping: (isTyping: boolean) => set({ isTyping })
})); 