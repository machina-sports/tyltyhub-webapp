"use client"

import { useGlobalState } from "@/store/useState"

import { ContainerChat } from "./container-chat"
import { ChatInput } from "./chat-input"

import { actionRetrieve, silentRetrieve } from "@/providers/threads/actions"
import { actionChat } from "@/providers/threads/actions"

import { clear } from "@/providers/threads/reducer"

import { useAppDispatch } from "@/store/dispatch"

import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive"
import { useEffect, useState } from "react"
import { trackNewMessage } from "@/lib/analytics"

export default function ContainerView({ threadId }: { threadId: string }) {

  const state = useGlobalState((state: any) => state.threads)

  const dispatch = useAppDispatch()

  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSendMessage(input, true)
    setInput('')
  }

  const handleSendMessage = async (message: string, shouldScroll = false) => {
    trackNewMessage(message)
    dispatch(actionChat({ thread_id: state.item.data?._id, message }))
  }

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

  const currentStatus = state.item.data?.value?.status
  const isTyping = currentStatus === "processing" || currentStatus === "waiting" || state.fields.status === "loading"

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mobile-container flex flex-col space-y-6 md:max-w-[1200px] mx-auto mb-4">
        <ContainerChat
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          onNewMessage={handleSendMessage}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isTyping={isTyping}
        />
      </div>
    </div>
  )
}

