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

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const metadata: Metadata = {
  title: "SportingBOT, a Inteligência Artificial da Sportingbet",
  description: "SportingBOT, a Inteligência Artificial da Sportingbet",
  icons: {
    icon: "/sb-new.ico",
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
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RP42Y35MC2"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
           window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RP42Y35MC2');
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* TallySight Widget */}
        <Script 
          data-tallysight-defaults-widget-config-workspace="sporting-bet" 
          type="module" 
          src="https://storage.googleapis.com/tallysight-widgets/dist/tallysight.min.js"  
          data-tallysight-widget-loading="lazy"
          strategy="lazyOnload"
        />
        <Providers>
          <MainProvider>
            <DiscoveryProvider>
              <div className="flex h-screen flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 overflow-auto pb-safe">{children}</main>
              </div>
              <Toaster />
            </DiscoveryProvider>
            <LGPDConsent />
          </MainProvider>
        </Providers>
      </body>
    </html>
  );
}
