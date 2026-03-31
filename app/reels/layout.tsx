import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { seoKeywords } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Mobile Reels & Social Proof",
  description:
    "Watch Instagram reels, unboxings, and product highlights from Mobile Gallery Ratlam.",
  keywords: [...seoKeywords, "mobile reels ratlam", "instagram reels mobile shop"],
  alternates: {
    canonical: "/reels",
  },
  openGraph: {
    title: `Reels | ${siteConfig.name}`,
    description:
      "Watch Instagram reels, unboxings, and product highlights from Mobile Gallery Ratlam.",
    type: "website",
    url: "/reels",
    siteName: siteConfig.name,
  },
}

export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return children
}

