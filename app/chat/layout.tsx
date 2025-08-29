import { Metadata } from "next"
import ChatClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Chat | bwinBOT - LaLiga 2025/2026",
  description: "Conversa con la Inteligencia Artificial de bwin sobre LaLiga 2025/2026. Resuelve dudas, consulta cuotas y realiza tus apuestas.",
  icons: {
    icon: "/bwin-logo-icon.png",
  },
  openGraph: {
    title: "Chat | bwinBOT - LaLiga 2025/2026",
    description: "Conversa con la Inteligencia Artificial de bwin sobre LaLiga 2025/2026. Resuelve dudas, consulta cuotas y realiza tus apuestas.",
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
    title: "Chat | bwinBOT - LaLiga 2025/2026",
    description: "Conversa con la Inteligencia Artificial de bwin sobre LaLiga 2025/2026. Resuelve dudas, consulta cuotas y realiza tus apuestas.",
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