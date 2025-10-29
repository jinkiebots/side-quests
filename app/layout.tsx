import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dust Bunny Collection',
  description: 'A collection of delightful prototypes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
