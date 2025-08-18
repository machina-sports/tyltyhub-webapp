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
      "flex w-full gap-3 mb-4",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Avatar />
        </div>
      )}
      
      <div className={cn(
        "max-w-[88%] rounded-2xl px-5 py-4 text-sm leading-relaxed",
        "break-words",
        isUser 
          ? "bg-bwin-brand-primary text-bwin-neutral-0 ml-auto" 
          : "bg-bwin-neutral-20 text-bwin-neutral-90 border border-bwin-neutral-30"
      )}>
        {children}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-bwin-neutral-30 flex items-center justify-center">
            <span className="text-xs font-medium text-bwin-neutral-90">Tú</span>
          </div>
        </div>
      )}
    </div>
  );
}