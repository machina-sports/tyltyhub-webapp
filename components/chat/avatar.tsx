"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  className?: string;
}

export function Avatar({ className }: AvatarProps) {
  return (
    <div className={cn(
      "w-8 h-8 rounded-full bg-bwin-brand-primary flex items-center justify-center overflow-hidden",
      className
    )}>
      <Image
        src="/bwin-logo-icon.png"
        alt="bwin"
        width={20}
        height={20}
        className="object-contain"
      />
    </div>
  );
}