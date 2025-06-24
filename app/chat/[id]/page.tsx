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
    description: 'A Inteligência Artificial da Sportingbet',
    openGraph: {
      title: 'SportingBOT | Chat',
      description: 'A Inteligência Artificial da Sportingbet',
      type: 'website',
      locale: 'pt_BR',
      siteName: 'SportingBOT',
      images: [
        {
          url: "/og_image_1.png",
          width: 1200,
          height: 630,
          alt: "SportingBOT: a IA da Sportingbet",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SportingBOT | Chat',
      description: 'A Inteligência Artificial da Sportingbet',
      images: ["/og_image_1.png"],
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
