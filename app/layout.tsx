import './globals.css'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Sportingbet AI',
  description: 'AI-Powered Sports Betting Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}