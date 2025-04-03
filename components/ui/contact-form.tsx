"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ContactFormProps {
  dictionary: {
    name: string
    email: string
    message: string
    submit: string
    success: string
    error: string
  }
}

export default function ContactForm({ dictionary }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")

      // Reset form after success
      const form = e.target as HTMLFormElement
      form.reset()

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">{dictionary.name}</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>

      <div>
        <Label htmlFor="email">{dictionary.email}</Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>

      <div>
        <Label htmlFor="message">{dictionary.message}</Label>
        <Textarea id="message" name="message" rows={5} required className="mt-1" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white hover:bg-primary/90">
        {isSubmitting ? "Sending..." : dictionary.submit}
      </Button>

      {submitStatus === "success" && <p className="text-green-600 mt-2">{dictionary.success}</p>}

      {submitStatus === "error" && <p className="text-red-600 mt-2">{dictionary.error}</p>}
    </form>
  )
}

