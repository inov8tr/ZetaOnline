"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, BookOpen, Edit, FileText, Loader2, Users } from "lucide-react"
import Link from "next/link"

interface CourseDetailsProps {
    params: {
        courseId: string
    }
}

export default function CourseDetailsPage({ params }: CourseDetailsProps) {
    const { courseId } = params
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [course, setCourse] = useState<any>(null)
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

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

                setCourse(courseData)

                // Fetch course enrollments
                const { data: enrollmentData, error: enrollmentError } = await supabase
                    .from("enrollments")
                    .select("*, profiles(*)")
                    .eq("course_id", courseId)

                if (enrollmentError) {
                    console.error("Error fetching enrollments:", enrollmentError)
                } else {
                    setEnrollments(enrollmentData || [])
                }
            } catch (err) {
                console.error("Error:", err)
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseDetails()
    }, [currentUser, courseId])

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
                    <h2 className="text-3xl font-bold tracking-tight">Course Details</h2>
                    <p className="text-muted-foreground">View and manage course information</p>
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

    if (!course) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Course Details</h2>
                    <p className="text-muted-foreground">View and manage course information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Course Not Found</CardTitle>
                        <CardDescription>The requested course could not be found</CardDescription>
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
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{course.title}</h2>
                    <p className="text-muted-foreground">Level: {course.level}</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/admin/courses">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Courses
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/dashboard/admin/courses/${courseId}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Course Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-1">Level</h3>
                            <Badge
                                variant="outline"
                                className={
                                    course.level === "Advanced"
                                        ? "bg-purple-50 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                                        : course.level === "Intermediate"
                                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                                            : "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                }
                            >
                                {course.level}
                            </Badge>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-1">Status</h3>
                            <Badge variant="default" className="bg-green-600">
                                Active
                            </Badge>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-1">Created</h3>
                            <p className="text-sm">{new Date(course.created_at).toLocaleDateString()}</p>
                        </div>
                        {course.updated_at && (
                            <div>
                                <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                                <p className="text-sm">{new Date(course.updated_at).toLocaleDateString()}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium mb-1">Enrolled Students</h3>
                            <p className="text-sm">{enrollments.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-3">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span>Overview</span>
                            </TabsTrigger>
                            <TabsTrigger value="students" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Students</span>
                            </TabsTrigger>
                            <TabsTrigger value="content" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Content</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Information</CardTitle>
                                    <CardDescription>Basic details about the course</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Description</h3>
                                            <p className="text-gray-700">{course.description}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Learning Objectives</h3>
                                            <p className="text-gray-700">
                                                This section will display the learning objectives for this course. In a complete implementation,
                                                these would be stored in the database.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Prerequisites</h3>
                                            <p className="text-gray-700">
                                                This section will display any prerequisites for this course. In a complete implementation, these
                                                would be stored in the database.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Statistics</CardTitle>
                                    <CardDescription>Performance metrics for this course</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-muted p-4 rounded-lg">
                                            <h3 className="text-sm font-medium mb-1">Completion Rate</h3>
                                            <p className="text-2xl font-bold">78%</p>
                                            <p className="text-xs text-muted-foreground">Average across all students</p>
                                        </div>
                                        <div className="bg-muted p-4 rounded-lg">
                                            <h3 className="text-sm font-medium mb-1">Average Score</h3>
                                            <p className="text-2xl font-bold">85%</p>
                                            <p className="text-xs text-muted-foreground">On assessments</p>
                                        </div>
                                        <div className="bg-muted p-4 rounded-lg">
                                            <h3 className="text-sm font-medium mb-1">Active Students</h3>
                                            <p className="text-2xl font-bold">{enrollments.length}</p>
                                            <p className="text-xs text-muted-foreground">Currently enrolled</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="students" className="space-y-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Enrolled Students</CardTitle>
                                        <CardDescription>Students currently enrolled in this course</CardDescription>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/dashboard/admin/courses/${courseId}/enroll`}>Enroll Students</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {enrollments.length > 0 ? (
                                        <div className="space-y-4">
                                            {enrollments.map((enrollment) => (
                                                <div key={enrollment.id} className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                                            <span className="font-medium text-primary">
                                                                {enrollment.profiles?.display_name?.substring(0, 2).toUpperCase() || "ST"}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{enrollment.profiles?.display_name || "Unnamed Student"}</p>
                                                            <p className="text-sm text-muted-foreground">{enrollment.profiles?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-sm">
                                                            <span className="font-medium">{enrollment.progress || 0}%</span> completed
                                                        </div>
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href={`/dashboard/admin/users/${enrollment.user_id}`}>View Student</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No students are currently enrolled in this course.</p>
                                            <p className="text-sm">Click "Enroll Students" to add students to this course.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="content" className="space-y-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Course Content</CardTitle>
                                        <CardDescription>Lessons and materials for this course</CardDescription>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/dashboard/admin/courses/${courseId}/content/create`}>Add Content</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No content has been added to this course yet.</p>
                                        <p className="text-sm">Click "Add Content" to create lessons and materials.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

