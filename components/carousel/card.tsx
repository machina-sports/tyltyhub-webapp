import { cn } from "@/lib/utils"

import { useTheme } from '@/components/theme-provider'

const Card = () => {

  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <div className={cn(
      "mt-0 mb-4 max-w-[350px]",
      "rounded-lg border p-4",
      isDarkMode
        ? "dark border-[#FFCB00]/30 bg-card"
        : "border-border bg-card"
    )}>
    </div>
  )
}

export default Card