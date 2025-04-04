"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, Clock, GraduationCap, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CourseEnrollPageProps {
    params: {
        courseId: string
    }
}

export default function CourseEnrollPage({ params }: CourseEnrollPageProps) {
    const { courseId } = params
    const router = useRouter()
    const { user } = useAuth()
    const [course, setCourse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEnrolling, setIsEnrolling] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return

            try {
                const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single()

                if (error) {
                    console.error("Error fetching course:", error)
                    setError("Course not found")
                    return
                }

                setCourse(data)
            } catch (err) {
                console.error("Error:", err)
                setError("Failed to load course details")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourse()
    }, [courseId])

    const handleEnroll = async () => {
        if (!user || !course) return

        setIsEnrolling(true)
        setError(null)

        try {
            const { error } = await supabase.from("enrollments").insert({
                user_id: user.id,
                course_id: course.id,
                status: "active",
                progress: 0,
            })

            if (error) {
                setError(error.message)
                toast.error("Failed to enroll in course")
            } else {
                setSuccess(true)
                toast.success("Successfully enrolled in course")
            }
        } catch (err) {
            console.error("Error enrolling in course:", err)
            setError("An unexpected error occurred")
            toast.error("An unexpected error occurred")
        } finally {
            setIsEnrolling(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error && !course) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Course Enrollment</h2>
                    <p className="text-muted-foreground">Enroll in a new course</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild variant="outline">
                            <a href="/dashboard/student/courses" className="flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Courses
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Course Enrollment</h2>
                <p className="text-muted-foreground">Enroll in a new course</p>
            </div>

            {success ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            <CardTitle>Enrollment Successful</CardTitle>
                        </div>
                        <CardDescription>You have successfully enrolled in {course.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            You can now access all course materials and start your learning journey. Your progress will be tracked
                            automatically as you complete lessons and assignments.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button asChild variant="outline">
                            <a href="/dashboard/student/courses">View All Courses</a>
                        </Button>
                        <Button asChild>
                            <a href={`/dashboard/student/courses/${course.id}`}>Start Learning</a>
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{course?.title}</CardTitle>
                                    <CardDescription>Level: {course?.level}</CardDescription>
                                </div>
                                <Badge variant="outline">{course?.level}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span>8 weeks</span>
                                </div>
                                <div className="flex items-center">
                                    <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span>12 lessons</span>
                                </div>
                                <div className="flex items-center">
                                    <GraduationCap className="mr-1 h-4 w-4 text-muted-foreground" />
                                    <span>Certificate</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-sm font-medium mb-2">Course Description</h4>
                                <p className="text-sm text-muted-foreground">{course?.description}</p>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-sm font-medium mb-2">What You'll Learn</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li className="flex items-start">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                                        <span>Comprehensive understanding of {course?.level} English concepts</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                                        <span>Practical communication skills for real-world situations</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                                        <span>Grammar and vocabulary appropriate for your level</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                                        <span>Reading, writing, listening, and speaking skills</span>
                                    </li>
                                </ul>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button asChild variant="outline">
                                <a href="/dashboard/student/courses" className="flex items-center">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </a>
                            </Button>
                            <Button onClick={handleEnroll} disabled={isEnrolling}>
                                {isEnrolling ? "Enrolling..." : "Enroll Now"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                            <CardDescription>Preview of what you'll be learning in this course</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border rounded-md">
                                <div className="p-4 border-b">
                                    <h4 className="font-medium">Module 1: Introduction</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Get familiar with the course structure and basic concepts
                                    </p>
                                </div>
                                <div className="p-4 border-b">
                                    <h4 className="font-medium">Module 2: Core Concepts</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Learn the fundamental principles and vocabulary</p>
                                </div>
                                <div className="p-4 border-b">
                                    <h4 className="font-medium">Module 3: Practical Applications</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Apply your knowledge in real-world scenarios</p>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-medium">Module 4: Advanced Topics</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Deepen your understanding with advanced material</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-sm font-medium mb-2">Course Includes</h4>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-center">
                                        <BookOpen className="mr-2 h-4 w-4 text-primary" />
                                        <span>12 comprehensive lessons</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 h-4 w-4 text-primary"
                                        >
                                            <path d="M21 15V6" />
                                            <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                            <path d="M12 12H3" />
                                            <path d="M16 6H3" />
                                            <path d="M12 18H3" />
                                        </svg>
                                        <span>24 interactive exercises</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 h-4 w-4 text-primary"
                                        >
                                            <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                                            <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                                            <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                                            <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                                        </svg>
                                        <span>4 quizzes and assessments</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 h-4 w-4 text-primary"
                                        >
                                            <circle cx="12" cy="8" r="6" />
                                            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                                        </svg>
                                        <span>Completion certificate</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

