"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface ResultsPageProps {
  params: {
    locale: Locale
  }
}

export default function ResultsPage({ params: { locale } }: ResultsPageProps) {
  const router = useRouter()
  const [testUser, setTestUser] = useState<any>(null)

  useEffect(() => {
    // Check if user has registered
    const userData = localStorage.getItem("testUser")

    if (!userData) {
      // Redirect to registration page if no user data
      router.push(`/${locale}/entrance-test`)
      return
    }

    setTestUser(JSON.parse(userData))
  }, [router, locale])

  // Mock test results
  const results = {
    score: 78,
    level: "Intermediate",
    breakdown: {
      reading: 82,
      grammar: 75,
      vocabulary: 80,
      listening: 76,
    },
    recommendation: "Based on your test results, we recommend our Intermediate English Program.",
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center bg-[#1e4b8e] text-white rounded-t-lg">
          <CardTitle className="text-2xl">Your Test Results</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {testUser && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Hello, {testUser.fullName}</h2>
              <p className="text-gray-600">Thank you for completing the entrance test.</p>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-[#1e4b8e] stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${(2.5 * Math.PI * 40 * results.score) / 100} ${2.5 * Math.PI * 40}`}
                  strokeDashoffset={2.5 * Math.PI * 10}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" className="text-3xl font-bold" dominantBaseline="middle" textAnchor="middle">
                  {results.score}%
                </text>
              </svg>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e4b8e]">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Your Level: {results.level}
            </h3>
            <p className="text-gray-700 mb-4">{results.recommendation}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Skill Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(results.breakdown).map(([skill, score]) => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{skill}</span>
                    <span className="text-sm font-medium">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#1e4b8e] h-2 rounded-full" style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#1e4b8e] hover:bg-[#163a71]">
              <a href={`/${locale}/program/${results.level.toLowerCase()}`}>View Recommended Program</a>
            </Button>

            <Button asChild variant="outline">
              <a href={`/${locale}/dashboard/student`}>Go to Dashboard</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

