"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isValidLink, setIsValidLink] = useState(true)
    const router = useRouter()

    // Check if the reset password link is valid
    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error || !data.session) {
                setIsValidLink(false)
                toast.error("Invalid or expired password reset link")
            }
        }

        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsSubmitting(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            setIsSubmitting(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            })

            if (error) {
                setError(error.message)
                toast.error(error.message)
            } else {
                toast.success("Password updated successfully")
                // Redirect to login page after a short delay
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }
        } catch (err) {
            console.error("Error resetting password:", err)
            setError("An unexpected error occurred. Please try again.")
            toast.error("An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isValidLink) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired. Please request a new password reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push("/forgot-password")} className="w-full">
                            Request New Link
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create new password</CardTitle>
                    <CardDescription>Enter your new password below to reset your account password</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Reset Password"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

