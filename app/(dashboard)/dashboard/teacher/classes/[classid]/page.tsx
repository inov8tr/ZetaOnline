"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Clock, FileText, Loader2, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ClassPageProps {
    params: {
        classId: string
    }
}

export default function ClassPage({ params }: ClassPageProps) {
    const { classId } = params
    const router = useRouter()
    const { user } = useAuth()
    const [classData, setClassData] = useState<any>(null)
    const [students, setStudents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        const fetchClassData = async () => {
            if (!classId || !user) return

            try {
                // Fetch class details
                const { data: classData, error: classError } = await supabase
                    .from("classes")
                    .select("*, courses(*)")
                    .eq("id", classId)
                    .single()

                if (classError) {
                    console.error("Error fetching class:", classError)
                    setError("Class not found")
                    return
                }

                // Verify teacher has access to this class
                if (classData.teacher_id !== user.id) {
                    setError("You do not have permission to access this class")
                    return
                }

                setClassData(classData)

                // Fetch students in this class
                const { data: enrollments, error: enrollmentsError } = await supabase
                    .from("enrollments")
                    .select("*, profiles(*)")
                    .eq("class_id", classId)

                if (enrollmentsError) {
                    console.error("Error fetching enrollments:", enrollmentsError)
                    return
                }

                setStudents(enrollments || [])
            } catch (err) {
                console.error("Error:", err)
                setError("Failed to load class details")
            } finally {
                setIsLoading(false)
            }
        }

        fetchClassData()
    }, [classId, user])

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
                    <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
                    <p className="text-muted-foreground">Manage your class and students</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/teacher/classes">Back to Classes</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{classData?.name}</h2>
                    <p className="text-muted-foreground">{classData?.courses?.title}</p>
                </div>
                <Badge variant={classData?.status === "active" ? "default" : "outline"}>{classData?.status}</Badge>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{students.length}</div>
                                <p className="text-xs text-muted-foreground">Enrolled in this class</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Lessons</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">Total lessons</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4</div>
                                <p className="text-xs text-muted-foreground">Total assessments</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Schedule</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">{classData?.schedule || "Flexible"}</div>
                                <p className="text-xs text-muted-foreground">Class schedule</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class Information</CardTitle>
                                <CardDescription>Details about this class</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {classData?.description || classData?.courses?.description || "No description available."}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-1">Course Level</h4>
                                    <p className="text-sm text-muted-foreground">{classData?.courses?.level}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-1">Start Date</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {classData?.start_date ? new Date(classData.start_date).toLocaleDateString() : "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-1">End Date</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {classData?.end_date ? new Date(classData.end_date).toLocaleDateString() : "Not specified"}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline">
                                    <Link href={`/dashboard/teacher/classes/${classId}/edit`}>Edit Class Information</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks for this class</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                        <Link href={`/dashboard/teacher/classes/${classId}/students`}>
                                            <Users className="h-6 w-6 mb-2" />
                                            <span>Manage Students</span>
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                        <Link href={`/dashboard/teacher/classes/${classId}/lessons`}>
                                            <BookOpen className="h-6 w-6 mb-2" />
                                            <span>Manage Lessons</span>
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                        <Link href={`/dashboard/teacher/classes/${classId}/assessments`}>
                                            <FileText className="h-6 w-6 mb-2" />
                                            <span>Manage Assessments</span>
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                        <Link href={`/dashboard/teacher/classes/${classId}/progress`}>
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
                                                className="h-6 w-6 mb-2"
                                            >
                                                <path d="M3 3v18h18" />
                                                <path d="m19 9-5 5-4-4-3 3" />
                                            </svg>
                                            <span>View Progress</span>
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                    <Card>
                        <CardHeader className="flex justify-between items-start">
                            <div>
                                <CardTitle>Students</CardTitle>
                                <CardDescription>Students enrolled in this class</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={`/dashboard/teacher/classes/${classId}/students/add`}>Add Students</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {students.length > 0 ? (
                                <div className="space-y-4">
                                    {students.map((enrollment) => (
                                        <div key={enrollment.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                                    <span className="font-medium text-primary">
                                                        {enrollment.profiles?.display_name?.substring(0, 2).toUpperCase() || "ST"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{enrollment.profiles?.display_name}</p>
                                                    <p className="text-sm text-muted-foreground">{enrollment.profiles?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{enrollment.progress || 0}% Complete</Badge>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/dashboard/teacher/students/${enrollment.user_id}`}>View Progress</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">No students enrolled in this class yet.</p>
                                    <Button asChild>
                                        <Link href={`/dashboard/teacher/classes/${classId}/students/add`}>Add Students</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lessons" className="space-y-4">
                    <Card>
                        <CardHeader className="flex justify-between items-start">
                            <div>
                                <CardTitle>Lessons</CardTitle>
                                <CardDescription>Course lessons for this class</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={`/dashboard/teacher/classes/${classId}/lessons/create`}>Create Lesson</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Lesson 1: Introduction</p>
                                        <p className="text-sm text-muted-foreground">Basic concepts and course overview</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Published</Badge>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/classes/${classId}/lessons/1`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Lesson 2: Core Vocabulary</p>
                                        <p className="text-sm text-muted-foreground">Essential words and phrases</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Published</Badge>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/classes/${classId}/lessons/2`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Lesson 3: Grammar Basics</p>
                                        <p className="text-sm text-muted-foreground">Fundamental grammar rules</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Draft</Badge>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/classes/${classId}/lessons/3`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="assessments" className="space-y-4">
                    <Card>
                        <CardHeader className="flex justify-between items-start">
                            <div>
                                <CardTitle>Assessments</CardTitle>
                                <CardDescription>Tests and quizzes for this class</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={`/dashboard/teacher/classes/${classId}/assessments/create`}>Create Assessment</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Module 1 Assessment</p>
                                        <p className="text-sm text-muted-foreground">Covers lessons 1-3</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Published</Badge>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/classes/${classId}/assessments/1`}>View Results</Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Vocabulary Quiz</p>
                                        <p className="text-sm text-muted-foreground">Essential vocabulary test</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Scheduled</Badge>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/classes/${classId}/assessments/2`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Final Exam</p>
                                        <p className="text-sm text-muted-foreground">Comprehensive course assessment</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Draft</Badge>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/classes/${classId}/assessments/3`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

