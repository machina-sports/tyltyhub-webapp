// import { ResponsibleGamingFloating } from "@/components/responsible-gaming-floating";
import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { AgeVerification } from "@/components/ui/age-verification";
import { LGPDConsent } from "@/components/ui/lgpd-consent";
import { Toaster } from "@/components/ui/toaster";
import { MainProvider } from "@/components/use-provider";
import DiscoveryProvider from "@/providers/discover/provider";
import { Providers } from "@/providers/provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const metadata: Metadata = {
  title: "bwinBOT: la IA de bwin para LaLiga 2025/2026",
  description: "Apuesta junto con la Inteligencia Artificial de bwin. Pregunta a nuestro chat sobre las noticias y cuotas de LaLiga 2025/2026 y descubre cómo apostar mejor.",
  icons: {
    icon: "/bwin-logo-icon.png",
  },
  openGraph: {
    title: "bwinBOT: la IA de bwin para LaLiga 2025/2026",
    description: "Apuesta junto con la Inteligencia Artificial de bwin. Pregunta a nuestro chat sobre las noticias y cuotas de LaLiga 2025/2026 y descubre cómo apostar mejor.",
    type: "website",
    locale: "es_ES",
    siteName: "bwinBOT",
    url: "https://bwinbot.com",
    images: [
      {
        url: "https://bwinbot.com/og_image_4.png",
        width: 1200,
        height: 630,
        alt: "bwinBOT: la IA de bwin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bwinBOT: la IA de bwin para LaLiga 2025/2026",
    description: "Apuesta junto con la Inteligencia Artificial de bwin. Pregunta a nuestro chat sobre las noticias y cuotas de LaLiga 2025/2026 y descubre cómo apostar mejor.",
    images: ["https://bwinbot.com/og_image_4.png"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-ES">
      <head>
        <link rel="icon" href="/bwin-logo-icon.png" />
        {/* Google tag (gtag.js) - GA4 Property */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RP42Y35MC2"
        />
        {/* Google tag (gtag.js) - Secondary GA4 Property */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9F6CHT1XS6"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
           window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RP42Y35MC2');
          gtag('config', 'G-9F6CHT1XS6');
          `,
          }}
        />
        <script
          async
          type="module"
          data-tallysight-defaults-widget-config-workspace="bwin-spain"
          src="https://storage.googleapis.com/tallysight-widgets/dist/tallysight.min.js"
          data-tallysight-widget-loading="lazy"
          data-tallysight-observer="true"
        />
        <meta property="og:logo" content="https://bwinbot.com/og_image_4.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <MainProvider>
            <DiscoveryProvider>
              <div className="flex h-screen flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Topbar />
                  {children}
                  <ResponsibleGamingResponsive />
                </main>
              </div>
            </DiscoveryProvider>
            <AgeVerification />
            <LGPDConsent />
            <Toaster />
          </MainProvider>
        </Providers>
      </body>
    </html>
  );
}
