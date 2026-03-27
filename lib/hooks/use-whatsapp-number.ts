"use client"

import { useMemo } from "react"
import { useAppSettings } from "@/lib/hooks/use-app-settings"
import { siteConfig } from "@/lib/site-config"

export function useWhatsAppNumber() {
  const { data } = useAppSettings()

  return useMemo(() => {
    const raw = data.whatsappNumber || siteConfig.whatsappNumber
    return raw.replace(/[^\d]/g, "")
  }, [data.whatsappNumber])
}
