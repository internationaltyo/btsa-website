import type { Metadata } from 'next'
import GlobalNav from './components/GlobalNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'BTSA — Belgium Tamil Sports Association',
  description: 'Football, Cricket, Volleyball & Athletics',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <GlobalNav />
        {children}
      </body>
    </html>
  )
}
