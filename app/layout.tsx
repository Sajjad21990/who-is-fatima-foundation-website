import type { Metadata } from 'next'
import { Poppins, Amiri } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { LayoutWrapper } from '@/components/LayoutWrapper'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
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
    <html lang="en" className={`${poppins.className} ${amiri.variable}`}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}
