import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ghibli Recipes',
  description: 'This is ghibli recipe',
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
