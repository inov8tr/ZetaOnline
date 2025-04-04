"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface EditUserProps {
    params: {
        userId: string
    }
}

export default function EditUserPage({ params }: EditUserProps) {
    const { userId } = params
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        displayName: "",
        role: "",
    })
    const [originalEmail, setOriginalEmail] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!currentUser) return

            try {
                // Check if current user is admin
                const { data: adminCheck, error: adminError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", currentUser.id)
                    .single()

                if (adminError) {
                    console.error("Error checking admin status:", adminError)
                    setError("Failed to verify admin privileges")
                    setIsLoading(false)
                    return
                }

                if (adminCheck.role !== "admin") {
                    setError("You do not have permission to access this page")
                    setIsLoading(false)
                    return
                }

                // Fetch user profile
                const { data: userData, error: userError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", userId)
                    .single()

                if (userError) {
                    console.error("Error fetching user:", userError)
                    setError("User not found")
                    setIsLoading(false)
                    return
                }

                setFormData({
                    email: userData.email,
                    displayName: userData.display_name || "",
                    role: userData.role,
                })
                setOriginalEmail(userData.email)
            } catch (err) {
                console.error("Error:", err)
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserDetails()
    }, [currentUser, userId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }))
        if (errors.role) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors.role
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.displayName.trim()) {
            newErrors.displayName = "Name is required"
        }

        if (!formData.role) {
            newErrors.role = "Role is required"
        }

        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsSaving(true)

        try {
            // Update profile in database
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    email: formData.email,
                    display_name: formData.displayName,
                    role: formData.role,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", userId)

            if (updateError) {
                console.error("Error updating user:", updateError)
                toast.error("Failed to update user")
                setIsSaving(false)
                return
            }

            // If email was changed, update auth email
            if (formData.email !== originalEmail) {
                // Note: In a real app, you would need admin privileges in Supabase
                // to update a user's email. This is just a placeholder.
                console.log("Email changed from", originalEmail, "to", formData.email)
                // In a real implementation, you would use the Supabase Admin API
            }

            toast.success("User updated successfully")
            router.push(`/dashboard/admin/users/${userId}`)
        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
                    <p className="text-muted-foreground">Update user information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin/users">Back to Users</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
                <p className="text-muted-foreground">Update user information</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Edit the user's details</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayName">Full Name</Label>
                            <Input
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className={errors.displayName ? "border-red-500" : ""}
                            />
                            {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button asChild variant="outline">
                            <Link href={`/dashboard/admin/users/${userId}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

