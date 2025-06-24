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
        url: "/og_image_1.png",
        width: 1200,
        height: 630,
        alt: "SportingBOT: a IA da Sportingbet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat | SportingBOT - Mundial de Clubes 2025",
    description: "Converse com a Inteligência Artificial da Sportingbet sobre o Mundial de Clubes FIFA 2025. Tire dúvidas, veja odds e faça suas apostas.",
    images: ["/og_image_1.png"],
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