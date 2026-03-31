import { siteConfig } from "@/lib/site-config"

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://mobile-gallery.vercel.app"

export const seoKeywords = [
  "mobile gallery",
  "mobile shop",
  "mobile store",
  "smartphone shop",
  "best mobile shop",
  "buy mobile online",
  "iphone store",
  "samsung store",
  "oneplus phones",
  "mobile accessories",
  "phone deals",
  "mobile offers",
  "mobile reviews",
  "mobile shop ratlam",
  "best mobile shop in ratlam",
  "ratlam mobile store",
  "smartphone shop ratlam",
  "iphone in ratlam",
  "samsung in ratlam",
  "mobile accessories ratlam",
  "electronics store ratlam",
  "mobile repair and sales ratlam",
  "whatsapp mobile order ratlam",
  "madhya pradesh mobile shop",
]

export const defaultTitle = `${siteConfig.name} | Mobile Shop In Ratlam`

export const defaultDescription =
  "Mobile Gallery is a premium mobile shop in Ratlam for smartphones, accessories, reels, reviews, and WhatsApp ordering."

