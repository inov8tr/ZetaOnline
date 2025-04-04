"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateCoursePage() {
    const router = useRouter()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "Beginner",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleLevelChange = (value: string) => {
        setFormData((prev) => ({ ...prev, level: value }))
        if (errors.level) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors.level
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        }

        if (!formData.level) {
            newErrors.level = "Level is required"
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

        setIsLoading(true)

        try {
            // Check if current user is admin
            const { data: adminCheck, error: adminError } = await supabase
                .from("profiles")
                .select("role")
                .eq("user_id", user?.id)
                .single()

            if (adminError) {
                console.error("Error checking admin status:", adminError)
                toast.error("Failed to verify admin privileges")
                setIsLoading(false)
                return
            }

            if (adminCheck.role !== "admin") {
                toast.error("You do not have permission to create courses")
                setIsLoading(false)
                return
            }

            // Create course in database
            const { data, error } = await supabase
                .from("courses")
                .insert({
                    title: formData.title,
                    description: formData.description,
                    level: formData.level,
                })
                .select()

            if (error) {
                console.error("Error creating course:", error)
                toast.error("Failed to create course")
                setIsLoading(false)
                return
            }

            toast.success("Course created successfully")
            router.push("/dashboard/admin/courses")
        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Create Course</h2>
                <p className="text-muted-foreground">Add a new course to the platform</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>Enter the details for the new course</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={errors.description ? "border-red-500" : ""}
                                rows={5}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Select value={formData.level} onValueChange={handleLevelChange}>
                                <SelectTrigger id="level" className={errors.level ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin/courses">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Course"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

