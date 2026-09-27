import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoteReady — Your first vote, step by step',
  description: 'A beginner-friendly, politically neutral guide for first-time Indian voters, with an AI assistant.',
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#FF6B00' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
