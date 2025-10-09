"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface QuestionButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const QuestionButton = memo(({ text, onClick, className }: QuestionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-6 py-3 mx-2 text-sm font-medium rounded-xl transition-all duration-200",
        "bg-bwin-neutral-20 text-bwin-neutral-90 border border-bwin-neutral-30",
        "hover:bg-brand-primary hover:text-bwin-neutral-0 hover:border-brand-primary",
        "active:scale-95 whitespace-nowrap",
        className
      )}
    >
      {text}
    </button>
  );
});

QuestionButton.displayName = "QuestionButton";

export default QuestionButton;