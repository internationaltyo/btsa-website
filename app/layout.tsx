import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BTSA — Belgium Tamil Sports Association',
  description: 'Football, Cricket, Volleyball & Athletics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
