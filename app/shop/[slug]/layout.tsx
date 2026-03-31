import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  description:
    "View product details, specifications, price, and WhatsApp order options from Mobile Gallery Ratlam.",
  keywords: [
    "mobile product details",
    "mobile specs ratlam",
    "phone price ratlam",
    "order mobile on whatsapp",
  ],
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: `Product Details | ${siteConfig.name}`,
    description:
      "View product details, specifications, price, and WhatsApp order options from Mobile Gallery Ratlam.",
    type: "website",
    siteName: siteConfig.name,
  },
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}

