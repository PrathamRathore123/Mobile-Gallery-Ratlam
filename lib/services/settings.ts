import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { COLLECTIONS, SETTINGS_DOC_ID } from "@/lib/constants/collections"
import { db } from "@/lib/firebase/client"
import { stringOrDefault, toDate } from "@/lib/firebase/parsers"
import type { AppSettings, SettingsInput } from "@/lib/types/entities"

const defaultSettings: AppSettings = {
  businessName: "Mobile Gallery",
  whatsappNumber: "919876543210",
  instagramUrl: "https://instagram.com/mobilegallery",
  heroTitle: "Premium smartphones for modern life",
  heroSubtitle: "Discover flagship phones and accessories with quick WhatsApp support.",
  supportText: "Need help choosing a device? Chat with us on WhatsApp.",
  updatedAt: null,
}

function mapSettings(data?: Record<string, unknown>): AppSettings {
  if (!data) return defaultSettings

  return {
    businessName: stringOrDefault(data.businessName, defaultSettings.businessName),
    whatsappNumber: stringOrDefault(data.whatsappNumber, defaultSettings.whatsappNumber),
    instagramUrl: stringOrDefault(data.instagramUrl, defaultSettings.instagramUrl),
    heroTitle: stringOrDefault(data.heroTitle, defaultSettings.heroTitle),
    heroSubtitle: stringOrDefault(data.heroSubtitle, defaultSettings.heroSubtitle),
    supportText: stringOrDefault(data.supportText, defaultSettings.supportText),
    updatedAt: toDate(data.updatedAt),
  }
}

export async function getSettings(): Promise<AppSettings> {
  const ref = doc(db, COLLECTIONS.settings, SETTINGS_DOC_ID)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    return defaultSettings
  }

  return mapSettings(snapshot.data() as Record<string, unknown>)
}

export async function upsertSettings(input: SettingsInput): Promise<void> {
  const ref = doc(db, COLLECTIONS.settings, SETTINGS_DOC_ID)

  await setDoc(
    ref,
    {
      ...input,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export { defaultSettings }
