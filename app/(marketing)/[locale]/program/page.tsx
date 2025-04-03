import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import SectionWrapper from "@/components/ui/section-wrapper"
import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/lib/i18n-config"
import CoreLearningDiagram from "@/components/sections/core-learning-diagram"

export default async function ProgramPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  return (
    <>
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Our English Programs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive English learning programs designed to help you achieve fluency at any level.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Core-Centered Learning Approach</h2>
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
          </div>

          <div>
            <CoreLearningDiagram />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="beginner">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image src="/placeholder.svg?height=400&width=600" alt="Beginner Program" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Beginner Program</h2>
            <p className="text-gray-600 mb-4">
              Our Beginner Program is designed for students with little to no prior English knowledge. This program
              focuses on building a strong foundation in English through immersive learning experiences.
            </p>
            <h3 className="font-bold text-lg mb-2">What You'll Learn:</h3>
            <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-600">
              <li>Basic vocabulary for everyday situations</li>
              <li>Essential grammar structures</li>
              <li>Simple conversation skills</li>
              <li>Reading and writing fundamentals</li>
              <li>Pronunciation basics</li>
            </ul>
            <Button asChild>
              <Link href={`/${locale}/program/beginner`}>Learn More</Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="intermediate" className="bg-gray-50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-bold mb-4">Intermediate Program</h2>
            <p className="text-gray-600 mb-4">
              The Intermediate Program builds on the foundation established in the Beginner Program, helping students
              expand their vocabulary, improve grammar accuracy, and develop more complex communication skills.
            </p>
            <h3 className="font-bold text-lg mb-2">What You'll Learn:</h3>
            <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-600">
              <li>Expanded vocabulary across various topics</li>
              <li>More complex grammar structures</li>
              <li>Fluent conversation in everyday situations</li>
              <li>Reading comprehension of authentic materials</li>
              <li>Writing clear paragraphs and short essays</li>
            </ul>
            <Button asChild>
              <Link href={`/${locale}/program/intermediate`}>Learn More</Link>
            </Button>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg order-1 md:order-2">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Intermediate Program"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="advanced">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <Image src="/placeholder.svg?height=400&width=600" alt="Advanced Program" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Advanced Program</h2>
            <p className="text-gray-600 mb-4">
              Our Advanced Program is designed for students who already have a strong command of English and want to
              achieve near-native fluency. This program focuses on nuance, cultural context, and sophisticated
              expression.
            </p>
            <h3 className="font-bold text-lg mb-2">What You'll Learn:</h3>
            <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-600">
              <li>Sophisticated vocabulary and idiomatic expressions</li>
              <li>Advanced grammar and syntax</li>
              <li>Nuanced communication for professional contexts</li>
              <li>Critical analysis of complex texts</li>
              <li>Writing persuasive and well-structured essays</li>
            </ul>
            <Button asChild>
              <Link href={`/${locale}/program/advanced`}>Learn More</Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}

