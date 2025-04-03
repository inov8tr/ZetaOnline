"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import { useTranslation } from "@/lib/client-dictionary"

interface Testimonial {
  name: string
  role: string
  image: string
  content: string
  rating: number
}

interface TestimonialSectionProps {
  locale: Locale
  testimonials?: Testimonial[]
}

export default function TestimonialSection({ locale, testimonials: customTestimonials }: TestimonialSectionProps) {
  const { t } = useTranslation(locale)
  const [activeIndex, setActiveIndex] = useState(0)

  const defaultTestimonials = [
    {
      name: "Sarah Johnson",
      role: "Student",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Zeta English Academy transformed my learning experience. The teachers are incredibly supportive and the curriculum is engaging. I've improved my English skills significantly in just a few months!",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Parent",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "My daughter loves attending Zeta. The personalized approach has helped her gain confidence in speaking English. The teachers really understand how to make learning fun and effective.",
      rating: 5,
    },
    {
      name: "Emily Chen",
      role: "Student",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "The interactive lessons and supportive environment at Zeta made all the difference in my English journey. I feel much more confident now when communicating in English.",
      rating: 5,
    },
  ]

  const testimonials = customTestimonials || defaultTestimonials

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("home.testimonials.title", "What Our Students Say")}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("home.testimonials.subtitle", "Hear from our community of learners")}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative h-24 w-24 rounded-full overflow-hidden">
                <Image
                  src={testimonials[activeIndex].image || "/placeholder.svg"}
                  alt={testimonials[activeIndex].name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#ffc72c] text-[#ffc72c]" />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-4">"{testimonials[activeIndex].content}"</p>

                <div>
                  <h4 className="font-bold">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === activeIndex ? "bg-[#1e4b8e]" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

