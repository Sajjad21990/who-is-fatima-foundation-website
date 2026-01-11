import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingSocials } from '@/components/FloatingSocials'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: {
    default: 'Who is Fatima Foundation',
    template: '%s | Who is Fatima Foundation'
  },
  description: 'Empowering communities through education, healthcare, and sustainable development.',
  metadataBase: new URL('https://whoisfatima.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whoisfatima.org',
    siteName: 'Who is Fatima Foundation',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingSocials />
        <Toaster />
      </body>
    </html>
  )
}
