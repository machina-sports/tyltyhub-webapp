import ChatHome from "@/components/chat/container-home"

import {
  fetchSiteRetrieve,
  fetchTopQuestions
} from '@/functions/site-retrieve'

export default async function HomePage() {

  const topQuestions = await fetchTopQuestions()

  const mockTopQuestions = [
    "Quais são as odds do Fluminense contra o Manchester City?",
    "Quando é o próximo jogo do Mundial de Clubes?",
    "Quem são os favoritos para vencer o Mundial?",
    "Como apostar no Mundial de Clubes?",
    "Qual é o histórico do Fluminense contra times europeus?",
    "Quais são as odds do Al-Ahly no Mundial?"
  ]

  return (
    <>
      <ChatHome query={''} topQuestions={mockTopQuestions} />
    </>
  )
}