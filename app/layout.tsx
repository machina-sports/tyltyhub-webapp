import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from "@/components/theme-provider"
import DiscoveryProvider from '@/providers/discover/provider'
import { MainProvider } from '@/components/use-provider'
import { Providers } from '@/providers/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sportingbet CWC',
  description: 'Sportingbet CWC',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="light">
      <body className={inter.className}>
        <Providers>
          <MainProvider>
            <DiscoveryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
              >
                <div className="flex h-screen flex-col md:flex-row">
                  <Sidebar />
                  <main className="flex-1 overflow-auto pb-safe">
                    {children}
                  </main>
                </div>
                <Toaster />
              </ThemeProvider>
            </DiscoveryProvider>
          </MainProvider>
        </Providers>
      </body>
    </html>
  )
}