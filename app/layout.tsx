import type { Metadata } from 'next'
import { Bebas_Neue, Manrope, Oswald, Playfair_Display, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas' })

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Premium Mobile Store`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: `${siteConfig.name} | Premium Mobile Store`,
    description: siteConfig.description,
    type: 'website',
    siteName: siteConfig.name,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" />
      </head>
      <body className={`${manrope.variable} ${sora.variable} ${playfair.variable} ${oswald.variable} ${bebas.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            {children}
            <CartDrawer />
            <Toaster />
          </CartProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
