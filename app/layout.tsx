import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers/provider";
import DiscoveryProvider from "@/providers/discover/provider";
import { MainProvider } from "@/components/use-provider";
import { LGPDConsent } from "@/components/ui/lgpd-consent";
import { AgeVerification } from "@/components/ui/age-verification";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const metadata: Metadata = {
  title: "SportingBOT: a IA da Sportingbet no Mundial de Clubes 2025",
  description: "Aposte junto com a Inteligência Artificial da Sportingbet. Pergunte ao nosso chat sobre as notícias e odds do Mundial de Clubes 2025 e veja como apostar melhor.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SportingBOT: a IA da Sportingbet no Mundial de Clubes 2025",
    description: "Aposte junto com a Inteligência Artificial da Sportingbet. Pergunte ao nosso chat sobre as notícias e odds do Mundial de Clubes 2025 e veja como apostar melhor.",
    type: "website",
    locale: "pt_BR",
    siteName: "SportingBOT",
    images: [
      {
        url: "/kv-txt-op1_980x250px_bot_.gif",
        width: 980,
        height: 250,
        alt: "SportingBOT: a IA da Sportingbet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SportingBOT: a IA da Sportingbet no Mundial de Clubes 2025",
    description: "Aposte junto com a Inteligência Artificial da Sportingbet. Pergunte ao nosso chat sobre as notícias e odds do Mundial de Clubes 2025 e veja como apostar melhor.",
    images: ["/kv-txt-op1_980x250px_bot_.gif"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
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
          data-tallysight-defaults-widget-config-workspace="sporting-bet" 
          src="https://storage.googleapis.com/tallysight-widgets/dist/tallysight.min.js"
          data-tallysight-widget-loading="lazy"
          data-tallysight-observer="true"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <MainProvider>
            <DiscoveryProvider>
              <div className="flex h-screen flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 overflow-auto pb-safe">{children}</main>
              </div>
              <Toaster />
            </DiscoveryProvider>
            <AgeVerification />
            <LGPDConsent />
          </MainProvider>
        </Providers>
      </body>
    </html>
  );
}
