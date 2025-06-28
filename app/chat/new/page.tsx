import ContainerHome from "@/components/chat/container-home"

import { fetchChatRegister } from '@/functions/chat-register'

import { redirect } from 'next/navigation'

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: { eventCode?: string, q?: string, user_id?: string }
}) {

  const data = await fetchChatRegister({
    query: searchParams.q || '',
    eventCode: searchParams.eventCode || '',
    user_id: searchParams.user_id || ''
  })

  if (searchParams.q && data.items["_id"]) {
    redirect(`/chat/${data.items["_id"]}`)
  }

  return <ContainerHome query={searchParams.q || ''} />
}