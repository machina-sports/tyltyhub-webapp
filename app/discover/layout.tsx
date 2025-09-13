import { SearchProvider } from "@/components/discover/search-context"
import CalendarProvider from "@/providers/calendar/provider"
import StandingsProvider from "@/providers/standings/provider"
import { Metadata } from "next"
import DiscoverClientLayout from "./client-layout"
import { getBrandConfig } from "@/config/brands"

// Get brand configuration
const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin';
const brand = getBrandConfig(brandId);

export const metadata: Metadata = {
  title: `Descobrir | ${brand.displayName}`,
  description: brand.description,
  icons: {
    icon: brand.content.favicon,
  },
  openGraph: {
    title: `Descobrir | ${brand.displayName}`,
    description: brand.description,
    type: "website",
    locale: brand.locale,
    siteName: brand.displayName,
    images: [
      {
        url: brand.content.ogImage,
        width: 980,
        height: 250,
        alt: brand.displayName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Descobrir | ${brand.displayName}`,
    description: brand.description,
    images: [brand.content.ogImage],
  },
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchProvider>
      <StandingsProvider>
        <DiscoverClientLayout>
          <CalendarProvider>
            {children}
          </CalendarProvider>
        </DiscoverClientLayout>
      </StandingsProvider>
    </SearchProvider>
  )
}