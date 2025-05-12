import ContainerView from "@/components/chat/container-view"

import ThreadProvider from "@/providers/threads/provider"

export default function ChatPage({
  params,
}: {
  params: { id?: string }
}) {
  return (
    <ThreadProvider>
      <ContainerView threadId={params.id || ''} />
    </ThreadProvider>
  )
}
