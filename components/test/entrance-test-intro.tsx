"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, FileText, Headphones } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface EntranceTestIntroProps {
  locale: Locale
}

export default function EntranceTestIntro({ locale }: EntranceTestIntroProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nativeLanguage: "",
    reason: "",
    agreement: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreement: checked }))
    // Clear error when field is edited
    if (formErrors.agreement) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreement
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of birth is required"
    }

    if (!formData.nativeLanguage.trim()) {
      errors.nativeLanguage = "Native language is required"
    }

    if (!formData.reason) {
      errors.reason = "Please select a reason"
    }

    if (!formData.agreement) {
      errors.agreement = "You must agree to the terms"
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Store user data in localStorage for the test session
      localStorage.setItem(
        "testUser",
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          startTime: new Date().toISOString(),
        }),
      )

      // Redirect to the test questions page
      setTimeout(() => {
        router.push(`/${locale}/entrance-test/questions`)
      }, 1000)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setFormErrors({
        submit: error.message || "There was an error submitting the form. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome to the English Entrance Test</h2>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Before you begin the test, please take a moment to read the following important information:
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Purpose of the Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                This entrance test is designed to assess your current English proficiency so that we can place you in
                the class that best fits your needs.
              </p>
              <p className="text-gray-700">
                The test is comprehensive and will evaluate your ability in four key areas:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Reading Comprehension</li>
                <li>Grammar</li>
                <li>Vocabulary</li>
                <li>Listening Comprehension</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                About the Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span>
                    The test is <strong>dynamically generated</strong>, so you may receive different questions each
                    time.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span>
                    You will have a <strong>total of 60 minutes</strong> to complete the test.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span>It is important that you take the test seriously and do your best.</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span>
                    Please find a quiet place, prepare headphones (for the listening section), and make sure you have a
                    stable internet connection.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Test Format
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Reading Comprehension</h4>
                <p className="text-sm text-gray-600">Read passages and answer related questions.</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Grammar</h4>
                <p className="text-sm text-gray-600">Choose correct grammatical structures.</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Vocabulary</h4>
                <p className="text-sm text-gray-600">Identify word meanings, synonyms, and appropriate usage.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Headphones className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Listening Comprehension</h4>
                <p className="text-sm text-gray-600">Listen to audio clips and answer questions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e4b8e]">
            <CheckCircle className="h-5 w-5 text-green-600" />
            After the Test
          </h3>
          <p className="text-gray-700">
            Once you submit the test, your results will be automatically calculated, and you'll receive your placement
            recommendation.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Register to Start the Test</h2>
        <p className="mb-8">Please fill out this form to register and start the test:</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={formErrors.fullName ? "border-red-500" : ""}
              />
              {formErrors.fullName && <p className="text-red-500 text-sm">{formErrors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={formErrors.dateOfBirth ? "border-red-500" : ""}
              />
              {formErrors.dateOfBirth && <p className="text-red-500 text-sm">{formErrors.dateOfBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nativeLanguage">
                Native Language <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nativeLanguage"
                name="nativeLanguage"
                value={formData.nativeLanguage}
                onChange={handleChange}
                className={formErrors.nativeLanguage ? "border-red-500" : ""}
              />
              {formErrors.nativeLanguage && <p className="text-red-500 text-sm">{formErrors.nativeLanguage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Taking the Test <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleSelectChange("reason", value)} value={formData.reason}>
                <SelectTrigger className={formErrors.reason ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_student">New Student</SelectItem>
                  <SelectItem value="program_placement">Program Placement</SelectItem>
                  <SelectItem value="personal_evaluation">Personal Evaluation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.reason && <p className="text-red-500 text-sm">{formErrors.reason}</p>}
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="agreement"
              checked={formData.agreement}
              onCheckedChange={handleCheckboxChange}
              className={formErrors.agreement ? "border-red-500" : ""}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="agreement"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to take this test honestly and without external help <span className="text-red-500">*</span>
              </Label>
              {formErrors.agreement && <p className="text-red-500 text-sm">{formErrors.agreement}</p>}
            </div>
          </div>

          {formErrors.submit && (
            <div className="bg-red-50 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{formErrors.submit}</p>
            </div>
          )}

          <div className="pt-4">
            <div className="bg-yellow-50 p-4 rounded-md mb-6 border border-yellow-100">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Final Instruction
              </h3>
              <p className="text-gray-700">
                Once you complete this form, you will be able to begin the test. Your timer will start immediately after
                clicking <strong>Start Test</strong>.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1e4b8e] hover:bg-[#163a71] text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Register & Start Test"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

