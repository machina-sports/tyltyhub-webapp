import { Metadata } from "next"
import StandingsProvider from "@/providers/standings/provider"
import DiscoverClientLayout from "./client-layout"
import CalendarProvider from "@/providers/calendar/provider"

export const metadata: Metadata = {
  title: "Descubrir | bwinBOT - LaLiga 2025/2026",
  description: "Descubre las últimas noticias, estadísticas y análisis de LaLiga 2025/2026. Sigue a los equipos, partidos y apuestas con la IA de bwin.",
  icons: {
    icon: "/bwin-logo-icon.png",
  },
  openGraph: {
    title: "Descubrir | bwinBOT - LaLiga 2025/2026",
    description: "Descubre las últimas noticias, estadísticas y análisis de LaLiga 2025/2026. Sigue a los equipos, partidos y apuestas con la IA de bwin.",
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
    title: "Descubrir | bwinBOT - LaLiga 2025/2026",
    description: "Descubre las últimas noticias, estadísticas y análisis de LaLiga 2025/2026. Sigue a los equipos, partidos y apuestas con la IA de bwin.",
    images: ["https://bwinbot.com/og_image_4.png"],
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
          <CalendarProvider>
            {children}
          </CalendarProvider>
      </DiscoverClientLayout>
    </StandingsProvider>
  )
}