import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Form Pengajuan Konten',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/logo kominfo.svg', // atau '/favicon.ico'
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
