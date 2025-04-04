"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) {
                setError(error.message)
                toast.error(error.message)
            } else {
                setIsSuccess(true)
                toast.success("Password reset link sent to your email")
            }
        } catch (err) {
            console.error("Error sending reset email:", err)
            setError("An unexpected error occurred. Please try again.")
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
                    <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
                </CardHeader>

                {isSuccess ? (
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Email sent</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>
                                            We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow
                                            the instructions to reset your password.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm">
                            <p>
                                Didn't receive the email?{" "}
                                <button onClick={() => setIsSuccess(false)} className="text-primary hover:underline font-medium">
                                    Try again
                                </button>
                            </p>
                        </div>
                    </CardContent>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send reset link"}
                            </Button>

                            <div className="text-center text-sm">
                                <Link href="/login" className="inline-flex items-center text-primary hover:underline">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    )
}

