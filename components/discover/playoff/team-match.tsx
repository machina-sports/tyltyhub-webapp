"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface TeamMatchProps {
  teamName: string;
  logo?: string;
  isSecond?: boolean;
  compact?: boolean;
}

export const TeamMatch = ({ teamName, logo, isSecond, compact = false }: TeamMatchProps) => {
  const { isDarkMode } = useTheme();
  
  const shouldShowLogo = logo && !teamName.startsWith('Winner Match') && !teamName.startsWith('Vencedor da Partida');
  
  return (
    <div className={`flex items-center gap-2 ${isSecond ? 'justify-start' : 'justify-end'}`}>
      {!isSecond && (
        <span className={cn(
          "font-medium overflow-wrap-normal word-break-normal",
          compact ? "text-xs" : "text-sm",
          isDarkMode ? "text-[#FFCB00]" : ""
        )}>
          {teamName}
        </span>
      )}
      {shouldShowLogo && (
        <div className={cn(
          "relative flex-shrink-0",
          compact ? "h-5 w-5" : "h-7 w-7"
        )}>
          <Image 
            src={logo} 
            alt={teamName} 
            fill 
            className="object-contain"
            sizes={compact ? "20px" : "28px"}
          />
        </div>
      )}
      {isSecond && (
        <span className={cn(
          "font-medium overflow-wrap-normal word-break-normal",
          compact ? "text-xs" : "text-sm",
          isDarkMode ? "text-[#FFCB00]" : ""
        )}>
          {teamName}
        </span>
      )}
    </div>
  );
}; 