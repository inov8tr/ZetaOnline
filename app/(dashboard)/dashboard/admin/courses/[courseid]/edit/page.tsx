"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface EditCourseProps {
    params: {
        courseId: string
    }
}

export default function EditCoursePage({ params }: EditCourseProps) {
    const { courseId } = params
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCourseDetails = async () => {
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

                // Fetch course details
                const { data: courseData, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", courseId)
                    .single()

                if (courseError) {
                    console.error("Error fetching course:", courseError)
                    setError("Course not found")
                    setIsLoading(false)
                    return
                }

                setFormData({
                    title: courseData.title,
                    description: courseData.description,
                    level: courseData.level,
                })
            } catch (err) {
                console.error("Error:", err)
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseDetails()
    }, [currentUser, courseId])

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

        setIsSaving(true)

        try {
            // Update course in database
            const { error: updateError } = await supabase
                .from("courses")
                .update({
                    title: formData.title,
                    description: formData.description,
                    level: formData.level,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", courseId)

            if (updateError) {
                console.error("Error updating course:", updateError)
                toast.error("Failed to update course")
                setIsSaving(false)
                return
            }

            toast.success("Course updated successfully")
            router.push(`/dashboard/admin/courses/${courseId}`)
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
                    <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
                    <p className="text-muted-foreground">Update course information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin/courses">Back to Courses</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
                <p className="text-muted-foreground">Update course information</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>Edit the course details</CardDescription>
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
                            <Link href={`/dashboard/admin/courses/${courseId}`}>
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

