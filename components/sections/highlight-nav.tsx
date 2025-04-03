"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import { useTranslation } from "@/lib/client-dictionary"

interface HighlightItem {
  title: string
  description: string
  icon: string
  href: string
}

interface HighlightNavProps {
  locale: Locale
  highlights?: HighlightItem[]
  title?: string
}

export default function HighlightNav({ locale, highlights, title }: HighlightNavProps) {
  const { t } = useTranslation(locale)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const defaultHighlights = [
    {
      title: t("home.highlights.items.0.title", "Personalized Learning"),
      description: t("home.highlights.items.0.description", "Tailored curriculum for each student's needs"),
      icon: "🎯",
      href: `/${locale}/approach`,
    },
    {
      title: t("home.highlights.items.1.title", "Expert Teachers"),
      description: t("home.highlights.items.1.description", "Experienced educators passionate about teaching"),
      icon: "👨‍🏫",
      href: `/${locale}/teachers`,
    },
    {
      title: t("home.highlights.items.2.title", "Modern Approach"),
      description: t("home.highlights.items.2.description", "Innovative methods that make learning engaging"),
      icon: "💡",
      href: `/${locale}/methodology`,
    },
  ]

  const displayHighlights = highlights || defaultHighlights
  const displayTitle = title || t("home.highlights.title", "Why Choose Zeta")

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {displayTitle}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {displayHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-4xl mb-4">{highlight.icon}</div>
              <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
              <p className="text-gray-600 mb-4">{highlight.description}</p>

              <Link
                href={highlight.href}
                className="inline-flex items-center text-[#1e4b8e] font-medium hover:text-[#0f2a52] group"
              >
                {t("common.learnMore", "Learn More")}
                <ChevronRight
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                    hoveredIndex === index ? "transform translate-x-1" : ""
                  }`}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

