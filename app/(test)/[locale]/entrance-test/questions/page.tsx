"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Locale } from "@/lib/i18n-config"

interface QuestionsPageProps {
  params: {
    locale: Locale
  }
}

export default function QuestionsPage({ params: { locale } }: QuestionsPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
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
    setIsLoading(false)
  }, [router, locale])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading test questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Questions</h1>
        <p className="mb-6">Welcome, {testUser?.fullName}. Your test is being prepared.</p>

        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <p className="text-sm">
            This is a placeholder for the actual test questions. In a complete implementation, this page would display
            questions fetched from the database.
          </p>
        </div>

        <Button onClick={() => router.push(`/${locale}/entrance-test/results`)} className="bg-primary">
          Submit Test (Demo)
        </Button>
      </Card>
    </div>
  )
}

