"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  className?: string;
}

export function Avatar({ className }: AvatarProps) {
  return (
    <div className={cn(
      "w-8 h-8 rounded-full bg-bwin-brand-primary flex items-center justify-center",
      "text-bwin-neutral-0 text-xs font-bold",
      className
    )}>
      BW
    </div>
  );
}