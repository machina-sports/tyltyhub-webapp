"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ArticleSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-6 pb-32 sm:pb-36 space-y-6 sm:space-y-8 animate-pulse">
      {/* Hero image skeleton */}
      <div className="relative h-[200px] sm:h-[400px] w-full overflow-hidden rounded-lg bg-muted"></div>

      <div className="space-y-6">
        {/* Category badge */}
        <Skeleton className="h-6 w-24 rounded-full" />

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 sm:h-10 w-full" />
          <Skeleton className="h-8 sm:h-10 w-5/6" />
        </div>
        
        {/* Subtitle */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* Author and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Event details */}
      <Skeleton className="h-32 w-full rounded-lg" />
      
      {/* Article sections */}
      {Array(4).fill(0).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>
      ))}
      
      {/* Voting section */}
      <Skeleton className="h-16 w-full" />
      
      {/* Related articles */}
      <div className="space-y-4 pt-6">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
} 