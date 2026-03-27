import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { TrendingSection } from "@/components/home/trending-section"
import { ReelsSection } from "@/components/home/reels-section"
import { ReviewsSection } from "@/components/home/reviews-section"
import { WhatsAppCTA } from "@/components/home/whatsapp-cta"
import { FadeUp } from "@/components/motion/fade-up"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FadeUp>
          <CategoriesSection />
        </FadeUp>
        <FadeUp delay={0.05}>
          <TrendingSection />
        </FadeUp>
        <FadeUp delay={0.1}>
          <ReelsSection />
        </FadeUp>
        <FadeUp delay={0.14}>
          <ReviewsSection />
        </FadeUp>
        <FadeUp delay={0.18}>
          <WhatsAppCTA />
        </FadeUp>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
