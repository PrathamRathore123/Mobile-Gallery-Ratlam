import type { Metadata } from 'next'
import { Bebas_Neue, Manrope, Oswald, Playfair_Display, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { WebsiteTracker } from '@/components/analytics/website-tracker'
import { siteConfig } from '@/lib/site-config'
import { defaultDescription, defaultTitle, seoKeywords, siteUrl } from '@/lib/seo'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescription,
  keywords: seoKeywords,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
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
    title: defaultTitle,
    description: defaultDescription,
    type: 'website',
    siteName: siteConfig.name,
    url: siteUrl,
    locale: "en_IN",
  },
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  name: siteConfig.name,
  url: siteUrl,
  image: `${siteUrl}/apple-icon.png`,
  description: defaultDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ratlam",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Ratlam",
    },
  ],
  telephone: siteConfig.whatsappDisplay,
  email: siteConfig.supportEmail,
  sameAs: [siteConfig.instagramUrl],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteUrl,
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${manrope.variable} ${sora.variable} ${playfair.variable} ${oswald.variable} ${bebas.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <WebsiteTracker />
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
