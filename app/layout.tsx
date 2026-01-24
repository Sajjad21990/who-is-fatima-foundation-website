import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { LayoutWrapper } from '@/components/LayoutWrapper'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

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
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}
