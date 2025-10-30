"use client";

import { Button } from "@/components/ui/button";
import { X, Maximize2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";

interface ChatHeaderProps {
  assistantName: string;
  onExpand?: () => void;
  onClose: () => void;
}

export function ChatHeader({ assistantName, onExpand, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <BrandLogo variant="icon" width={24} height={24} className="rounded" />
        <h2 className="text-lg font-semibold">{assistantName}</h2>
      </div>
      <div className="flex items-center gap-1">
        {onExpand && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="h-8 w-8 p-0 assistant-header-button"
            title="Expand to full page"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 assistant-header-button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

