import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { seoKeywords } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Contact Mobile Gallery Ratlam",
  description:
    "Contact Mobile Gallery in Ratlam for product enquiries, support, and WhatsApp ordering.",
  keywords: [...seoKeywords, "contact mobile shop ratlam", "mobile gallery ratlam contact"],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact | ${siteConfig.name}`,
    description:
      "Contact Mobile Gallery in Ratlam for product enquiries, support, and WhatsApp ordering.",
    type: "website",
    url: "/contact",
    siteName: siteConfig.name,
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

