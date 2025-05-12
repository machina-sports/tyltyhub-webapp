"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

interface DataFormSekeletonProps {
  isLoading: boolean
  length: number
}

export function FormSkeleton({ isLoading, length }: DataFormSekeletonProps) {
  if (isLoading) {
    return (
      <div className="grid">
        {Array.from({ length }).map((_, i) => (
          <div className="mt-2" key={i}>
            <div className="relative mb-3 border-none">
              <Skeleton className="h-4 w-1/3 mb-2" />
            </div>
            <Card className="relative p-2 mb-2 rounded-md border border-input bg-transparent">
              <Skeleton className="h-3 w-2/3" />
            </Card>
          </div>
        ))}
      </div>
    )
  }
}

export function GridSkeleton({ isLoading, length }: DataFormSekeletonProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length }).map((_, i) => (
          <Card key={i} className="relative">
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}

export function HeaderSkeleton({ isLoading, length }: DataFormSekeletonProps) {
  if (isLoading) {
    return (
      <div className="grid">
        {Array.from({ length }).map((_, i) => (
          <div className="mt-2 mb-2" key={i}>
            <div className="relative mb-3 border-none">
              <Skeleton className="h-4 w-1/3 mb-2" />
            </div>
            <div className="relative mb-3 border-none">
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export function TableSkeleton({ isLoading, length }: DataFormSekeletonProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 w-full">
        {Array.from({ length }).map((_, i) => (
          <div className="mt-2" key={i}>
            <div className="relative mb-3 border-none">
              <Skeleton className="h-4 w-1/3 mb-2" />
            </div>
            <Card className="relative p-2 mb-2 rounded-md border border-input bg-transparent">
              <Skeleton className="h-3 w-2/3" />
            </Card>
          </div>
        ))}
      </div>
    )
  }
}

export function TextSkeleton({ isLoading, length }: DataFormSekeletonProps) {
  if (isLoading) {
    return (
      <div className="grid">
        {Array.from({ length }).map((_, i) => (
          <div className="mt-1" key={i}>
            <div className="relative mb-3 border-none">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }
}
