import { Metadata } from "next"
import ChatClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Chat | SportingBOT - Mundial de Clubes 2025",
  description: "Converse com a Inteligência Artificial da Sportingbet sobre o Mundial de Clubes FIFA 2025. Tire dúvidas, veja odds e faça suas apostas.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Chat | SportingBOT - Mundial de Clubes 2025",
    description: "Converse com a Inteligência Artificial da Sportingbet sobre o Mundial de Clubes FIFA 2025. Tire dúvidas, veja odds e faça suas apostas.",
    type: "website",
    locale: "pt_BR",
    siteName: "SportingBOT",
    images: [
      {
        url: "https://sportingbot.com/og_image_4.png",
        width: 980,
        height: 250,
        alt: "SportingBOT: a IA da Sportingbet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat | SportingBOT - Mundial de Clubes 2025",
    description: "Converse com a Inteligência Artificial da Sportingbet sobre o Mundial de Clubes FIFA 2025. Tire dúvidas, veja odds e faça suas apostas.",
    images: ["https://sportingbot.com/og_image_4.png"],
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatClientLayout>
      {children}
    </ChatClientLayout>
  )
}