"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface ArticleSkeletonProps {
  layout?: 'fullWidth' | 'threeCards'
  count?: number
}

export function ArticleSkeleton({ layout = 'threeCards', count = 3 }: ArticleSkeletonProps) {
  const { isDarkMode } = useTheme();
  
  if (layout === 'fullWidth') {
    return (
      <Card className={cn(
        "overflow-hidden border animate-pulse",
        isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30"
      )}>
        <CardContent className="p-0">
          <div className="flex flex-col md:grid md:grid-cols-12 gap-0">
            <div className="md:col-span-7">
              <div className={cn(
                "relative aspect-[16/9] md:aspect-auto md:h-full w-full",
                isDarkMode ? "bg-[#45CAFF]/20" : "bg-muted"
              )}></div>
            </div>
            <div className="md:col-span-5 p-4 md:p-5 flex flex-col">
              <div className="space-y-3">
                <Skeleton className={cn(
                  "h-5 w-16",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
                <Skeleton className={cn(
                  "h-6 w-full",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
                <Skeleton className={cn(
                  "h-6 w-4/5",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
                <div className="space-y-2">
                  <Skeleton className={cn(
                    "h-4 w-full",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                  <Skeleton className={cn(
                    "h-4 w-full",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                  <Skeleton className={cn(
                    "h-4 w-2/3",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                </div>
              </div>
              
              <div className={cn(
                "flex items-center justify-between mt-auto pt-3 border-t",
                isDarkMode && "border-[#45CAFF]/30"
              )}>
                <div className="flex items-center gap-2">
                  <Skeleton className={cn(
                    "h-5 w-5 rounded-full",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                  <Skeleton className={cn(
                    "h-3 w-20",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                </div>
                <Skeleton className={cn(
                  "h-3 w-24",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
      {Array(count).fill(0).map((_, index) => (
        <Card key={index} className={cn(
          "overflow-hidden h-full border animate-pulse",
          isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30"
        )}>
          <CardContent className="p-0 flex flex-col h-full">
            <div className={cn(
              "relative aspect-[16/9] w-full",
              isDarkMode ? "bg-[#45CAFF]/20" : "bg-muted"
            )}></div>
            <div className="p-3 flex flex-col flex-grow">
              <div className="mb-2">
                <Skeleton className={cn(
                  "h-4 w-16",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
              </div>
              <Skeleton className={cn(
                "h-5 w-full mb-1",
                isDarkMode && "bg-[#45CAFF]/20"
              )} />
              <Skeleton className={cn(
                "h-5 w-4/5 mb-2",
                isDarkMode && "bg-[#45CAFF]/20"
              )} />
              <div className="mb-auto">
                <Skeleton className={cn(
                  "h-3 w-full mb-1",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
                <Skeleton className={cn(
                  "h-3 w-full mb-1",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
                <Skeleton className={cn(
                  "h-3 w-2/3",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
              </div>
              <div className={cn(
                "flex items-center justify-between mt-2 pt-2 border-t",
                isDarkMode && "border-[#45CAFF]/30"
              )}>
                <div className="flex items-center gap-1">
                  <Skeleton className={cn(
                    "h-4 w-4 rounded-full",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                  <Skeleton className={cn(
                    "h-3 w-16",
                    isDarkMode && "bg-[#45CAFF]/20"
                  )} />
                </div>
                <Skeleton className={cn(
                  "h-3 w-20",
                  isDarkMode && "bg-[#45CAFF]/20"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 