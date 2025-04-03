"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n-config"
import { useTranslation } from "@/lib/client-dictionary"
import CoreLearningDiagram from "./core-learning-diagram"

interface Program {
  title: string
  description: string
  image: string
  href: string
}

interface ProgramOverviewProps {
  locale: Locale
  programs?: Program[]
}

export default function ProgramOverview({ locale, programs: customPrograms }: ProgramOverviewProps) {
  const { t } = useTranslation(locale)

  const defaultPrograms = [
    {
      title: "Beginner Program",
      description: "Build a strong foundation in English with our comprehensive beginner program.",
      image: "/placeholder.svg?height=300&width=400",
      href: `/${locale}/program/beginner`,
    },
    {
      title: "Intermediate Program",
      description: "Expand your English skills and gain confidence in more complex communication.",
      image: "/placeholder.svg?height=300&width=400",
      href: `/${locale}/program/intermediate`,
    },
    {
      title: "Advanced Program",
      description: "Master advanced English concepts and express complex ideas with fluency.",
      image: "/placeholder.svg?height=300&width=400",
      href: `/${locale}/program/advanced`,
    },
  ]

  const programs = customPrograms || defaultPrograms

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("home.programs.title", "Our Programs")}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("home.programs.subtitle", "Comprehensive English learning for all levels")}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4">Core-Centered Learning Approach</h3>
            <p className="text-gray-600 mb-6">
              Our unique approach focuses on building a strong foundation before advancing to more complex concepts.
              This ensures that students develop confidence and fluency at each level before moving forward.
            </p>
            <p className="text-gray-600 mb-6">
              Each program is carefully designed to provide a comprehensive learning experience that addresses all
              aspects of language acquisition: reading, writing, listening, and speaking.
            </p>
            <Button asChild>
              <Link href={`/${locale}/methodology`}>Learn About Our Methodology</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CoreLearningDiagram />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48">
                <Image src={program.image || "/placeholder.svg"} alt={program.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <Link href={program.href} className="text-[#1e4b8e] font-medium hover:text-[#0f2a52]">
                  {t("common.learnMore", "Learn More")} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

