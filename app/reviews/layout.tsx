import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"
import { seoKeywords } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Customer Reviews In Ratlam",
  description:
    "Read genuine customer reviews for smartphones and accessories at Mobile Gallery Ratlam.",
  keywords: [...seoKeywords, "mobile shop reviews ratlam", "customer reviews mobile gallery"],
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: `Reviews | ${siteConfig.name}`,
    description:
      "Read genuine customer reviews for smartphones and accessories at Mobile Gallery Ratlam.",
    type: "website",
    url: "/reviews",
    siteName: siteConfig.name,
  },
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}

