"use client"

import { useGlobalState } from "@/store/useState"

import { ContainerChat } from "./container-chat"

import { actionRetrieve, silentRetrieve } from "@/providers/threads/actions"

import { clear } from "@/providers/threads/reducer"

import { useAppDispatch } from "@/store/dispatch"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

import { useEffect } from "react"

// import NavbarHeader from "@/components/navbar-header"

export default function ContainerView({ threadId }: { threadId: string }) {
  const { isDarkMode } = useTheme() 

  const state = useGlobalState((state: any) => state.threads)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (threadId) {
      dispatch(actionRetrieve({ thread_id: threadId }))
    }

    return () => {
      dispatch(clear())
    }
  }, [threadId])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (state.item.data?.value?.status === "waiting" || state.item.data?.value?.status === "processing") {
        try {
          dispatch(silentRetrieve({ thread_id: threadId }))
        } catch (error) {
          console.error('Error fetching thread updates:', error)
        }
      }
    }, 500)

    if (state.item.data?.value?.status === "idle") {
      clearInterval(interval)
    }

    return () => clearInterval(interval)

  }, [threadId, state.item.data?.value?.status])

  return (
    <div className={cn(
      "mobile-container md:pt-0 pb-4 md:pb-0 md:pb-0 space-y-6 md:max-w-[1200px] mx-auto",
      isDarkMode ? "bg-[#061F3F]" : "bg-background"
    )}>
      <div className="flex flex-col md:h-[calc(100vh-48px)] md:pt-0">
        <ContainerChat />
      </div>
    </div>
  )
}

