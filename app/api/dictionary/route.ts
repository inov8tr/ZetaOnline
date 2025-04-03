import { NextResponse } from "next/server"
import { i18n, type Locale } from "@/lib/i18n-config"

// Define dictionary structure
interface Dictionary {
  home: {
    hero: {
      title: string
      subtitle: string
      cta1: string
      cta2: string
    }
    highlights: {
      title: string
      items: Array<{
        title: string
        description: string
      }>
    }
    programs: {
      title: string
      subtitle: string
    }
    testimonials: {
      title: string
      subtitle: string
    }
  }
  common: {
    bookCta: string
    readMore: string
    learnMore: string
  }
}

// Hardcoded dictionaries for demo purposes
const dictionaries: Record<string, Dictionary> = {
  en: {
    home: {
      hero: {
        title: "Zeta English Academy",
        subtitle: "We Believe Learning Should Be Fun and Spark Creativity!",
        cta1: "Start Learning Today",
        cta2: "Explore Programs",
      },
      highlights: {
        title: "Why Choose Zeta",
        items: [
          {
            title: "Personalized Learning",
            description: "Tailored curriculum for each student's needs",
          },
          {
            title: "Expert Teachers",
            description: "Experienced educators passionate about teaching",
          },
          {
            title: "Modern Approach",
            description: "Innovative methods that make learning engaging",
          },
        ],
      },
      programs: {
        title: "Our Programs",
        subtitle: "Comprehensive English learning for all levels",
      },
      testimonials: {
        title: "What Our Students Say",
        subtitle: "Hear from our community of learners",
      },
    },
    common: {
      bookCta: "Book Your Appointment",
      readMore: "Read More",
      learnMore: "Learn More",
    },
  },
  ko: {
    home: {
      hero: {
        title: "제타 영어 아카데미",
        subtitle: "학습은 재미있고 창의성을 불러일으켜야 한다고 믿습니다!",
        cta1: "오늘 학습 시작하기",
        cta2: "프로그램 살펴보기",
      },
      highlights: {
        title: "제타를 선택하는 이유",
        items: [
          {
            title: "맞춤형 학습",
            description: "각 학생의 필요에 맞춘 커리큘럼",
          },
          {
            title: "전문 교사",
            description: "교육에 열정적인 경험 많은 교육자",
          },
          {
            title: "현대적 접근",
            description: "학습을 흥미롭게 만드는 혁신적인 방법",
          },
        ],
      },
      programs: {
        title: "우리의 프로그램",
        subtitle: "모든 수준을 위한 종합적인 영어 학습",
      },
      testimonials: {
        title: "학생들의 이야기",
        subtitle: "우리 학습자 커뮤니티의 소리를 들어보세요",
      },
    },
    common: {
      bookCta: "예약하기",
      readMore: "더 읽기",
      learnMore: "더 알아보기",
    },
  },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const localeParam = searchParams.get("locale") || "en"

    // Validate that the locale is supported
    const locale = i18n.locales.includes(localeParam as Locale) ? localeParam : i18n.defaultLocale

    // Get the dictionary for the locale
    const dictionary = dictionaries[locale] || dictionaries[i18n.defaultLocale]

    if (!dictionary) {
      return NextResponse.json({ error: "Dictionary not found" }, { status: 404 })
    }

    return NextResponse.json(dictionary)
  } catch (error) {
    console.error("Dictionary API error:", error)
    return NextResponse.json({ error: "Failed to retrieve dictionary" }, { status: 500 })
  }
}

