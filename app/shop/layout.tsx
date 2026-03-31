import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { seoKeywords } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Shop Mobile Phones In Ratlam",
  description:
    "Browse smartphones, accessories, and latest mobile deals in Ratlam from Mobile Gallery.",
  keywords: [
    ...seoKeywords,
    "shop mobiles ratlam",
    "buy smartphone ratlam",
    "ratlam phone store",
  ],
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: `Shop | ${siteConfig.name}`,
    description:
      "Browse smartphones, accessories, and latest mobile deals in Ratlam from Mobile Gallery.",
    type: "website",
    url: "/shop",
    siteName: siteConfig.name,
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}

