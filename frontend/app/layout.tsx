import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mission Control Dashboard - Maritime Training',
  description: 'Mission Control Dashboard for Singapore Maritime Training Sector',
  keywords: ['maritime', 'training', 'mission control', 'singapore', 'naval', 'defense'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-dark-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}