"use client"

import { ReactNode } from "react"

// Provider para o contexto de compartilhamento de chats
export default function ShareProvider({ children }: { children: ReactNode }) {
  // Este provider agora não cria uma store separada, apenas encapsula a funcionalidade
  // A store global já contém o reducer de compartilhamento
  return <>{children}</>
}
