import { HeroBackground } from "./hero/hero-background"
import { HeroContent } from "./hero/hero-content"
import { HeroVisual } from "./hero/hero-visual"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
      <HeroBackground />
      <div className="container px-4 md:px-8 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <HeroContent />
        <HeroVisual />
      </div>
    </section>
  )
}
