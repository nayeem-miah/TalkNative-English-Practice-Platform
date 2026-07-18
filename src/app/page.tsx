import { Faq } from "@/components/sections/faq";
import { FeaturedCourses } from "@/components/sections/featured-courses";
import { FeaturesStats } from "@/components/sections/features-stats";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Safety } from "@/components/sections/safety";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesStats />
      <FeaturedCourses />
      <HowItWorks />
      <Safety />
      <Testimonials />
      <Faq />
    </>
  );
}
