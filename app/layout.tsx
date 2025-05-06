
import './globals.css'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from "@/components/theme-provider"
import DataProvider from '@/providers/DataProvider'

export const metadata: Metadata = {
  title: 'Sportingbet AI',
  description: 'Sua Aposta Inteligente com IA',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased overflow-hidden">
        <DataProvider>
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
        </DataProvider>
      </body>
    </html>
  )
}