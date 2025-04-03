import HeroSection from "@/components/sections/hero-section"
import HighlightNav from "@/components/sections/highlight-nav"
import ProgramOverview from "@/components/sections/program-overview"
import TestimonialSection from "@/components/sections/testimonial-section"
import BookCta from "@/components/sections/book-cta"
import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/lib/i18n-config"

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  // Default values in case translations are missing
  const heroTitle = dict.home?.hero?.title || "Zeta English Academy"
  const heroSubtitle = dict.home?.hero?.subtitle || "We Believe Learning Should Be Fun and Spark Creativity!"
  const heroCta1 = dict.home?.hero?.cta1 || "Start Learning Today"
  const heroCta2 = dict.home?.hero?.cta2 || "Explore Programs"

  return (
    <>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} ctaText1={heroCta1} ctaText2={heroCta2} />

      {/* Highlight Navigation Section */}
      <HighlightNav locale={locale} />

      {/* Program Overview Section */}
      <ProgramOverview locale={locale} />

      {/* Testimonial Section */}
      <TestimonialSection locale={locale} />

      {/* Book CTA Section */}
      <BookCta locale={locale} />
    </>
  )
}

