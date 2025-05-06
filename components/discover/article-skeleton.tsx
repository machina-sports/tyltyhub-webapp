"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ArticleSkeletonProps {
  layout?: 'fullWidth' | 'threeCards'
  count?: number
}

export function ArticleSkeleton({ layout = 'threeCards', count = 3 }: ArticleSkeletonProps) {
  if (layout === 'fullWidth') {
    return (
      <Card className="overflow-hidden border animate-pulse">
        <CardContent className="p-0">
          <div className="flex flex-col md:grid md:grid-cols-12 gap-0">
            <div className="md:col-span-7">
              <div className="relative aspect-[16/9] md:aspect-auto md:h-full w-full bg-muted"></div>
            </div>
            <div className="md:col-span-5 p-4 md:p-5 flex flex-col">
              <div className="space-y-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-24" />
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
        <Card key={index} className="overflow-hidden h-full border animate-pulse">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative aspect-[16/9] w-full bg-muted"></div>
            <div className="p-3 flex flex-col flex-grow">
              <div className="mb-2">
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-4/5 mb-2" />
              <div className="mb-auto">
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 