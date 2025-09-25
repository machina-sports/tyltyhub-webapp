// import { ResponsibleGamingFloating } from "@/components/responsible-gaming-floating";
import { Footer } from "@/components/footer";
import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { AgeVerification } from "@/components/ui/age-verification";
import { LGPDConsent } from "@/components/ui/lgpd-consent";
import { Toaster } from "@/components/ui/toaster";
import { MainProvider } from "@/components/use-provider";
import DiscoveryProvider from "@/providers/discover/provider";
import { Providers } from "@/providers/provider";
import { BrandProvider } from "@/contexts/brand-context";
import { getBrandConfig } from "@/config/brands";
import { generateBrandMetadata } from "@/lib/metadata";
import { BrandColors } from "@/components/brand";
import { DynamicCSS } from "@/components/brand/dynamic-css";
import { SearchProvider } from "@/components/discover/search-context";
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

// Get brand configuration from environment variable
const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin';
const brand = getBrandConfig(brandId);

// Generate dynamic metadata based on brand
const { metadata, viewport } = generateBrandMetadata(brand);

export { metadata, viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={brand.language} data-brand={brandId}>
      <head>
        <link rel="icon" href={brand.content.favicon} />
        {/* Google Analytics will be loaded conditionally based on cookie consent */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize dataLayer for consent mode
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Set default consent state
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'wait_for_update': 500
              });
              
              // Check for existing consent
              const existingConsent = localStorage.getItem('cookie-consent');
              if (existingConsent) {
                const consent = JSON.parse(existingConsent);
                if (consent.analytics) {
                  gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                  });
                  
                  // Load GA4 scripts
                  const script1 = document.createElement('script');
                  script1.async = true;
                  script1.src = 'https://www.googletagmanager.com/gtag/js?id=${brand.analytics.ga4Primary}';
                  document.head.appendChild(script1);
                  
                  const script2 = document.createElement('script');
                  script2.async = true;
                  script2.src = 'https://www.googletagmanager.com/gtag/js?id=${brand.analytics.ga4Secondary}';
                  document.head.appendChild(script2);
                  
                  script1.onload = function() {
                    gtag('js', new Date());
                    gtag('config', '${brand.analytics.ga4Primary}');
                    gtag('config', '${brand.analytics.ga4Secondary}');
                  };
                }
              }
            `,
          }}
        />
        <meta property="og:logo" content={brand.content.ogImage} />
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            ${brandId === 'sportingbet' ? `
              /* Sportingbet Brand Colors - Cor fundamental */
              --brand-primary: 207 95.24% 41.18% !important;
              --brand-secondary: 207 95.24% 50% !important;
              --brand-success: 145 63% 49% !important;
              --brand-warning: 43 98% 53% !important;
              --brand-danger: 3 100% 59% !important;
              --brand-info: 204 86% 53% !important;
              --border-primary: 207 95.24% 41.18%;
              --bg-primary: 220 100% 8%;
              --bg-secondary: 220 100% 12%;
              --background: rgb(6, 31, 63);
            ` : `
              /* Bwin Brand Colors */
              --brand-primary: 48 100% 50% !important;
              --brand-secondary: 43 98% 53% !important;
              --brand-success: 145 63% 49% !important;
              --brand-warning: 43 98% 53% !important;
              --brand-danger: 3 100% 59% !important;
              --brand-info: 204 86% 53% !important;
              --border-primary: 48 100% 50%;
              --bg-primary: 0 0% 7%;
              --bg-secondary: 0 0% 12%;
              --background: 0 0% 7%;
            `}
            --neutral-100: 0 0% 100%;
            --neutral-90: 0 0% 90%;
            --neutral-80: 0 0% 70%;
            --neutral-70: 0 0% 55%;
            --neutral-60: 0 0% 40%;
            --neutral-50: 0 0% 29%;
            --neutral-40: 0 0% 24%;
            --neutral-30: 0 0% 18%;
            --neutral-25: 0 0% 15%;
            --neutral-20: 0 0% 12%;
            --neutral-15: 0 0% 10%;
            --neutral-10: 0 0% 7%;
            --neutral-0: 0 0% 0%;
          }
        ` }} />
      </head>
      <body className={inter.className}>
        <DynamicCSS />
        <BrandProvider>
          <BrandColors>
            <Providers>
              <MainProvider>
                <SearchProvider>
                  <DiscoveryProvider>
                    <div className="flex h-[calc(100vh-92px-env(safe-area-inset-bottom))] md:h-screen flex-col md:flex-row">
                      <Sidebar />
                      <main className="flex-1 overflow-none md:ml-80">
                        <Topbar />
                        <div className="flex-1 pb-safe">
                          {children}
                          <ResponsibleGamingResponsive />
                          <div className="h-32"></div>
                        </div>
                      </main>
                    </div>
                  </DiscoveryProvider>
                </SearchProvider>
                <AgeVerification />
                <Footer />
                <LGPDConsent />
                <Toaster />
              </MainProvider>
            </Providers>
          </BrandColors>
        </BrandProvider>
      </body>
    </html>
  );
}
