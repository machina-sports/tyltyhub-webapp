"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { useBrandColors } from "@/hooks/use-brand-colors";
import { useBrand } from "@/contexts/brand-context";

interface ChatBubbleProps {
  role: "user" | "assistant";
  children: ReactNode;
  className?: string;
}

export function ChatBubble({ role, children, className }: ChatBubbleProps) {
  const { brand } = useBrand();
  const isUser = role === "user";
  const userLabel = brand.id === 'sportingbet' ? 'Eu' : 'Tú';

  return (
    <div className={cn(
      "flex w-full gap-3 mb-4",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Avatar />
        </div>
      )}
      
      <div 
        className={cn(
          "max-w-[520px] rounded-2xl px-5 py-4 text-sm leading-relaxed",
          "break-words",
          isUser 
            ? "text-white ml-auto chat-bubble-user" 
            : "text-white chat-bubble-assistant"
        )}
      >
        {children}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
            backgroundColor: 'hsl(var(--neutral-30))',
            color: 'hsl(var(--neutral-90))'
          }}>
            <span className="text-xs font-medium">{userLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}