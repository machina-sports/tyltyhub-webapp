import { Metadata } from "next"
import StandingsProvider from "@/providers/standings/provider"
import DiscoverClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "Descobrir | SportingBOT - Mundial de Clubes 2025",
  description: "Descubra as últimas notícias, estatísticas e análises do Mundial de Clubes FIFA 2025. Acompanhe os times, jogos e apostas com a IA da Sportingbet.",
  openGraph: {
    title: "Descobrir | SportingBOT - Mundial de Clubes 2025",
    description: "Descubra as últimas notícias, estatísticas e análises do Mundial de Clubes FIFA 2025. Acompanhe os times, jogos e apostas com a IA da Sportingbet.",
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
    title: "Descobrir | SportingBOT - Mundial de Clubes 2025",
    description: "Descubra as últimas notícias, estatísticas e análises do Mundial de Clubes FIFA 2025. Acompanhe os times, jogos e apostas com a IA da Sportingbet.",
    images: ["https://sportingbot.com/og_image_4.png"],
  },
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StandingsProvider>
      <DiscoverClientLayout>
        {children}
      </DiscoverClientLayout>
    </StandingsProvider>
  )
}