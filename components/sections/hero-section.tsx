"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText1: string
  ctaText2: string
  ctaLink1?: string
  ctaLink2?: string
}

export default function HeroSection({
  title,
  subtitle,
  ctaText1,
  ctaText2,
  ctaLink1 = "/login",
  ctaLink2 = "/program",
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#1e4b8e] to-[#0f2a52] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ffc72c]/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
        <div className="max-w-3xl">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-blue-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild size="lg" className="bg-[#ffc72c] hover:bg-[#ffb700] text-[#1e4b8e] font-semibold">
              <Link href={ctaLink1}>{ctaText1}</Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href={ctaLink2}>{ctaText2}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

