"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";

interface ChatBubbleProps {
  role: "user" | "assistant";
  children: ReactNode;
  className?: string;
}

export function ChatBubble({ role, children, className }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn(
      "flex w-full gap-4",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser 
          ? "bg-bwin-brand-primary text-bwin-neutral-0 ml-auto" 
          : "bg-bwin-neutral-20 text-bwin-neutral-90 border border-bwin-neutral-30"
      )}>
        {children}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-bwin-neutral-30 flex items-center justify-center">
            <span className="text-xs font-medium text-bwin-neutral-90">Tú</span>
          </div>
        </div>
      )}
    </div>
  );
}