"use client"

import { MessageCircle, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSettings } from "@/lib/hooks/use-app-settings"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"

export function WhatsAppCTA() {
  const whatsappNumber = useWhatsAppNumber()
  const { data: settings } = useAppSettings()

  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  const handleWhatsApp = () => {
    window.open(`${whatsappUrl}?text=Hi! I am interested in your products.`, "_blank")
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#25D366]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 size-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            <div className="absolute bottom-0 left-0 size-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-white" />
          </div>

          <div className="relative px-6 py-10 md:px-12 md:py-16">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="text-white">
                <h2 className="mb-4 text-2xl font-bold md:text-3xl">Need Help Choosing?</h2>
                <p className="mb-6 leading-relaxed text-white/90">{settings.supportText}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="h-14 gap-2 rounded-2xl bg-white px-8 font-semibold text-[#25D366] hover:bg-white/90" onClick={handleWhatsApp}>
                    <MessageCircle className="size-5" />
                    Chat on WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 gap-2 rounded-2xl border-white/30 px-8 text-white hover:bg-white/10"
                    onClick={() => window.open(`tel:${whatsappNumber}`)}
                  >
                    <Phone className="size-5" />
                    Call Us
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MessageCircle, title: "Instant Response", desc: "Quick replies 24/7" },
                  { icon: Phone, title: "Expert Advice", desc: "Personalized help" },
                  { icon: Clock, title: "Fast Delivery", desc: "Same day shipping" },
                  { icon: MessageCircle, title: "Easy Returns", desc: "30-day policy" },
                ].map((feature) => (
                  <div key={feature.title} className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-sm">
                    <feature.icon className="mb-2 size-6" />
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-xs text-white/70">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
