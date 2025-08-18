import ContainerView from "@/components/chat/container-view"
import ShareProvider from "@/providers/share/provider"

import ThreadProvider from "@/providers/threads/provider"

// Metadata generation for improved sharing experience
export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id
  
  // In a real implementation, you would fetch the thread data from the API
  // For now, we'll use a default title and description
  
  return {
    title: 'Bwin BOT | Chat',
    description: 'A Inteligência Artificial da Sportingbet',
    openGraph: {
      title: 'Bwin BOT | Chat',
      description: 'A Inteligência Artificial da Sportingbet',
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Bwin BOT',
      images: [
        {
          url: 'https://sportingbot.com/og_image_4.png',
          width: 980,
          height: 250,
          alt: 'Bwin BOT',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bwin BOT | Chat',
      description: 'A Inteligência Artificial da Sportingbet',
      images: ['https://sportingbot.com/og_image_4.png'],
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
