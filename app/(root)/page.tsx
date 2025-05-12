import ChatHome from "@/components/chat/container-home"

import {
  fetchSiteRetrieve,
  fetchTopQuestions
} from '@/functions/site-retrieve'

export default async function HomePage() {

  const topQuestions = await fetchTopQuestions()

  return (
    <>
      <ChatHome query={''} topQuestions={topQuestions.items} />
    </>
  )
}