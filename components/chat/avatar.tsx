"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useBrandConfig } from "@/contexts/brand-context";

interface AvatarProps {
  className?: string;
}

export function Avatar({ className }: AvatarProps) {
  const brand = useBrandConfig();
  
  const iconSrc = brand.id === 'sportingbet' ? '/sb-new.png' : brand.branding.logo.icon;
  
  return (
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center overflow-hidden",
      className
    )}>
      <Image
        src={iconSrc}
        alt={brand.displayName}
        width={36}
        height={36}
        className="object-contain rounded-full"
      />
    </div>
  );
}