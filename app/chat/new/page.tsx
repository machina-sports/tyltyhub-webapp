import ContainerHome from "@/components/chat/container-home"

import { fetchChatRegister } from '@/functions/chat-register'

import { redirect } from 'next/navigation'

const mockTopQuestions = [
  "Quais são as odds do Fluminense contra o Manchester City?",
  "Quando é o próximo jogo do Mundial de Clubes?",
  "Quem são os favoritos para vencer o Mundial?",
  "Como apostar no Mundial de Clubes?",
  "Qual é o histórico do Fluminense contra times europeus?",
  "Quais são as odds do Al-Ahly no Mundial?"
]

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

  return <ContainerHome topQuestions={mockTopQuestions} query={searchParams.q || ''} />
}