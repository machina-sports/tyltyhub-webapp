import { Metadata } from "next"
import ChatClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Chat | bwinBOT - Copa Mundial de Clubes 2025",
  description: "Conversa con la Inteligencia Artificial de bwin sobre la Copa Mundial de Clubes FIFA 2025. Resuelve dudas, consulta cuotas y realiza tus apuestas.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Chat | bwinBOT - Copa Mundial de Clubes 2025",
    description: "Conversa con la Inteligencia Artificial de bwin sobre la Copa Mundial de Clubes FIFA 2025. Resuelve dudas, consulta cuotas y realiza tus apuestas.",
    type: "website",
    locale: "es_ES",
    siteName: "bwinBOT",
    images: [
      {
        url: "https://bwinbot.com/og_image_4.png",
        width: 980,
        height: 250,
        alt: "bwinBOT: la IA de bwin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat | bwinBOT - Copa Mundial de Clubes 2025",
    description: "Conversa con la Inteligencia Artificial de bwin sobre la Copa Mundial de Clubes FIFA 2025. Resuelve dudas, consulta cuotas y realiza tus apuestas.",
    images: ["https://bwinbot.com/og_image_4.png"],
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ChatClientLayout>{children}</ChatClientLayout>
}