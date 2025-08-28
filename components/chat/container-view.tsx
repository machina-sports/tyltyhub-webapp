"use client"

import { useGlobalState } from "@/store/useState"

import { ContainerChat } from "./container-chat"

import { actionRetrieve, silentRetrieve } from "@/providers/threads/actions"

import { clear } from "@/providers/threads/reducer"

import { useAppDispatch } from "@/store/dispatch"

import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive"
import { useEffect } from "react"

// import NavbarHeader from "@/components/navbar-header"

export default function ContainerView({ threadId }: { threadId: string }) { 

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
    <div className="min-h-screen w-full overflow-x-hidden bg-bwin-neutral-10 md:pb-0">
      <div className="mobile-container md:pt-0 space-y-6 md:max-w-[1200px] mx-auto min-h-screen flex flex-col">
        <ContainerChat />
      </div>
      
      {/* Responsible Gaming Footer */}
      <ResponsibleGamingResponsive />
    </div>
  )
}

