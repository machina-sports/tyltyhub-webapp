import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/providers/provider'
import DiscoveryProvider from '@/providers/discover/provider'
import { MainProvider } from '@/components/use-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sportingbet CWC',
  description: 'Sportingbet CWC',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <MainProvider>
            <DiscoveryProvider>
              <div className="flex h-screen flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 overflow-auto pb-safe">
                  {children}
                </main>
              </div>
              <Toaster />
            </DiscoveryProvider>
          </MainProvider>
        </Providers>
      </body>
    </html>
  )
}