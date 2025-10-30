"use client";

import { MessagePrimitive } from "@assistant-ui/react";
import { User } from "lucide-react";

export function UserMessage() {
  return (
    <div className="flex justify-end gap-3 items-start w-full">
      <div className="bg-primary user-message-bubble rounded-lg px-4 py-2 max-w-[80%] text-[15px] font-sans">
        <MessagePrimitive.Content />
      </div>
      {/* User Icon */}
      <div className="flex-shrink-0 mt-2 bg-primary/20 p-2 rounded-full">
        <User className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
}

