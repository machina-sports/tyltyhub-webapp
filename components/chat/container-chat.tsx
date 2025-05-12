"use client"

import { useState, useEffect, useRef } from "react"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { actionChat } from "@/providers/threads/actions"

import { ChatMessage } from "../chat-message"

import { useAppDispatch } from "@/store/dispatch"

import { useGlobalState } from "@/store/useState"

import { TableSkeleton } from "../skeleton"

export function ContainerChat() {

  const state = useGlobalState((state: any) => state.threads)

  const dispatch = useAppDispatch()

  // const [thread, setThread] = useState<any>(objectData)

  const [input, setInput] = useState('')

  const messageContainerRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!input.trim()) return

    handleSendMessage(input)

    setInput('')
  }

  const handleSendMessage = async (message: string) => {
    dispatch(actionChat({ thread_id: state.item.data?._id, message }))
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [state.item.data])

  const currentMessages = state.item.data?.value?.messages || []

  const currentStatus = state.item.data?.value?.status

  const isTyping = currentStatus === "processing" || currentStatus === "waiting" || state.fields.status === "loading"

  const isLoading = state.item.status === 'loading'

  return (
    <>
      <div className="flex-1 overflow-auto" ref={messageContainerRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-[24px]">
          <div className="space-y-6">
            {isLoading ? (
              <TableSkeleton isLoading={true} length={5} />
            ) : (
              <>
                {currentMessages.map((message: any, index: number) => (
                  <ChatMessage
                    key={index}
                    {...message}
                    isTyping={false}
                    onNewMessage={handleSendMessage}
                  />
                ))}
                {isTyping && (
                  <ChatMessage
                    role="assistant"
                    content=""
                    isTyping={true}
                    onNewMessage={handleSendMessage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fixed md:sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 mobile-safe-bottom">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative tap-highlight-none md:mt-4">
          <Input
            disabled={isTyping}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="w-full h-12 pl-4 pr-12 rounded-lg bg-secondary/50 border-0"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}