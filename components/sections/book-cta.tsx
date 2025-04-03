"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n-config"
import { useTranslation } from "@/lib/client-dictionary"
import { motion } from "framer-motion"

interface BookCtaProps {
  locale: Locale
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

export default function BookCta({
  locale,
  title = "Ready to start your English journey?",
  description = "Join Zeta English Academy today and discover the joy of learning English in a supportive, creative environment.",
  buttonText,
  buttonLink = "/book",
}: BookCtaProps) {
  const { t } = useTranslation(locale)
  const ctaText = buttonText || t("common.bookCta", "Book Your Appointment")

  return (
    <section className="bg-gradient-to-r from-[#1e4b8e] to-[#0f2a52] py-20 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-[#ffc72c]/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">{description}</p>
          <Button
            asChild
            size="lg"
            className="bg-[#ffc72c] hover:bg-[#ffb700] text-[#1e4b8e] font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href={`/${locale}${buttonLink}`}>
              <motion.span initial={{ opacity: 1 }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                {ctaText}
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

