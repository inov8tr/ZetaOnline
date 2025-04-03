import SectionWrapper from "@/components/ui/section-wrapper"
import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/lib/i18n-config"
import Image from "next/image"

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  return (
    <>
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">About Zeta English Academy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our mission is to provide exceptional English education that empowers students to communicate confidently
            and effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, Zeta English Academy began with a simple vision: to transform English education by making
              it engaging, effective, and accessible to all.
            </p>
            <p className="text-gray-600 mb-4">
              Our founder, Dr. Sarah Kim, recognized that traditional language learning methods often failed to produce
              confident English speakers. Drawing from her extensive background in linguistics and education, she
              developed a unique methodology that focuses on practical communication skills while building a strong
              foundation in grammar and vocabulary.
            </p>
            <p className="text-gray-600">
              Today, Zeta has grown into a leading English education provider, with thousands of successful students who
              have achieved their language goals and expanded their opportunities.
            </p>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Zeta English Academy campus"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#1e4b8e]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Growth Mindset</h3>
            <p className="text-gray-600">
              We believe in the power of continuous improvement and embrace challenges as opportunities to learn and
              grow.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#1e4b8e]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">
              We foster a supportive learning environment where students feel connected, respected, and empowered.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#1e4b8e]/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Innovation</h3>
            <p className="text-gray-600">
              We constantly seek new and better ways to teach English, incorporating the latest research and technology.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}

