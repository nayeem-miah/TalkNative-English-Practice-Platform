import { Hero } from "@/components/sections/hero";
import { FeaturesStats } from "@/components/sections/features-stats";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Safety } from "@/components/sections/safety";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesStats />
      <HowItWorks />
      <Safety />
      <Testimonials />
      <Faq />
    </>
  );
}
