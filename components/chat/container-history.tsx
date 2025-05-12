"use client"

import {
  Clock,
  History,
  MessageCircle,
  Newspaper,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { formatDistanceToNow } from "date-fns"

import { useGlobalState } from "@/store/useState"

import { TableSkeleton } from "../skeleton"

import Link from "next/link"

import { useRouter } from "next/navigation"

const HistoryItem = ({ item }: { item: any }) => {
  return (
    <div className="flex flex-1 flex-row justify-between border p-4 rounded-md w-full">
      <div>
        <div className="text-lg font-semibold">
          <Link href={`/chat/${item?._id}`}>
            {item?.value?.messages?.[0]?.content}
          </Link>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4 mr-1" />
          {formatDistanceToNow(new Date(item?.value?.messages?.[0]?.date), { addSuffix: true })}
        </div>
      </div>
      <div className="flex flex-row items-end">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <MessageCircle className="h-4 w-4 mr-1" />
          {item?.value?.messages?.length} message(s)
        </div>
      </div>
    </div>
  )
}

const ContainerHistory = () => {

  const state = useGlobalState((state: any) => state.threads)

  const history = state.list.items

  const router = useRouter()

  const handleGoToLatestNews = () => {
    router.push("/")
  }

  const handleGoToChat = () => {
    router.push("/chat/history")
  }

  return (
    <div className="mobile-container md:pt-4 pb-4 space-y-6 md:max-w-[1200px] mx-auto">
      <div className="flex flex-row justify-center w-full">
        <div className="flex flex-col max-w-4xl w-full">
          <div>
            <h1 className="text-center mb-6 sm:mb-8 mt-4">
              Your chat history
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center p-4 gap-4 w-full">
            {state.list.status === 'loading' ? (
              <TableSkeleton isLoading={true} length={5} />
            ) : (
              history.map((item: any) => (
                <HistoryItem key={item._id} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContainerHistory