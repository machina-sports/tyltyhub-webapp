import ContainerView from "@/components/chat/container-view"
import ShareProvider from "@/providers/share/provider"

import ThreadProvider from "@/providers/threads/provider"

// Metadata generation for improved sharing experience
export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id
  
  // In a real implementation, you would fetch the thread data from the API
  // For now, we'll use a default title and description
  
  return {
    title: 'SportingBOT | Chat',
    description: 'A Inteligência Artificial da SportingBet',
    openGraph: {
      title: 'SportingBOT | Chat',
      description: 'A Inteligência Artificial da SportingBet',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SportingBOT | Chat',
      description: 'A Inteligência Artificial da SportingBet',
    }
  }
}

export default function ChatPage({
  params,
}: {
  params: { id?: string }
}) {
  return (
    <ThreadProvider>
      <ShareProvider>
        <ContainerView threadId={params.id || ''} />
      </ShareProvider>
    </ThreadProvider>
  )
}
