import ContainerHistory from "@/components/chat/container-history"

import ThreadsProvider from "@/providers/threads/provider"

export default function HistoryPage() {

  return (
    <ThreadsProvider>
      <ContainerHistory />
    </ThreadsProvider>
  )
}
