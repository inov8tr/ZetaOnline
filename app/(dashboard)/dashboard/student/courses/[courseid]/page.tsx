"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle, FileText, Loader2, PlayCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface CoursePageProps {
    params: {
        courseId: string
    }
}

export default function CoursePage({ params }: CoursePageProps) {
    const { courseId } = params
    const router = useRouter()
    const { user } = useAuth()
    const [course, setCourse] = useState<any>(null)
    const [enrollment, setEnrollment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeLesson, setActiveLesson] = useState<any>(null)
    const [currentModule, setCurrentModule] = useState<string | null>(null)

    // Mock course modules and lessons
    const modules = [
        {
            id: "module-1",
            title: "Module 1: Introduction",
            description: "Get familiar with the course structure and basic concepts",
            lessons: [
                {
                    id: "lesson-1-1",
                    title: "Welcome to the Course",
                    duration: "10 min",
                    type: "video",
                    completed: true,
                },
                {
                    id: "lesson-1-2",
                    title: "Course Overview",
                    duration: "15 min",
                    type: "reading",
                    completed: true,
                },
                {
                    id: "lesson-1-3",
                    title: "Getting Started Quiz",
                    duration: "10 min",
                    type: "quiz",
                    completed: false,
                },
            ],
        },
        {
            id: "module-2",
            title: "Module 2: Core Concepts",
            description: "Learn the fundamental principles and vocabulary",
            lessons: [
                {
                    id: "lesson-2-1",
                    title: "Basic Vocabulary",
                    duration: "20 min",
                    type: "video",
                    completed: false,
                },
                {
                    id: "lesson-2-2",
                    title: "Grammar Fundamentals",
                    duration: "25 min",
                    type: "reading",
                    completed: false,
                },
                {
                    id: "lesson-2-3",
                    title: "Practice Exercises",
                    duration: "30 min",
                    type: "exercise",
                    completed: false,
                },
                {
                    id: "lesson-2-4",
                    title: "Module 2 Assessment",
                    duration: "15 min",
                    type: "quiz",
                    completed: false,
                },
            ],
        },
        {
            id: "module-3",
            title: "Module 3: Practical Applications",
            description: "Apply your knowledge in real-world scenarios",
            lessons: [
                {
                    id: "lesson-3-1",
                    title: "Conversation Practice",
                    duration: "30 min",
                    type: "video",
                    completed: false,
                },
                {
                    id: "lesson-3-2",
                    title: "Real-world Examples",
                    duration: "20 min",
                    type: "reading",
                    completed: false,
                },
                {
                    id: "lesson-3-3",
                    title: "Interactive Scenarios",
                    duration: "40 min",
                    type: "exercise",
                    completed: false,
                },
            ],
        },
        {
            id: "module-4",
            title: "Module 4: Advanced Topics",
            description: "Deepen your understanding with advanced material",
            lessons: [
                {
                    id: "lesson-4-1",
                    title: "Advanced Concepts",
                    duration: "35 min",
                    type: "video",
                    completed: false,
                },
                {
                    id: "lesson-4-2",
                    title: "Case Studies",
                    duration: "25 min",
                    type: "reading",
                    completed: false,
                },
                {
                    id: "lesson-4-3",
                    title: "Final Assessment",
                    duration: "45 min",
                    type: "quiz",
                    completed: false,
                },
            ],
        },
    ]

    useEffect(() => {
        const fetchCourseAndEnrollment = async () => {
            if (!courseId || !user) return

            try {
                // Fetch course details
                const { data: courseData, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", courseId)
                    .single()

                if (courseError) {
                    console.error("Error fetching course:", courseError)
                    setError("Course not found")
                    return
                }

                setCourse(courseData)

                // Fetch enrollment details
                const { data: enrollmentData, error: enrollmentError } = await supabase
                    .from("enrollments")
                    .select("*")
                    .eq("course_id", courseId)
                    .eq("user_id", user.id)
                    .single()

                if (enrollmentError && enrollmentError.code !== "PGRST116") {
                    console.error("Error fetching enrollment:", enrollmentError)
                    setError("Failed to load enrollment details")
                    return
                }

                if (!enrollmentData) {
                    setError("You are not enrolled in this course")
                    return
                }

                setEnrollment(enrollmentData)

                // Set initial active lesson based on progress
                const completedCount = modules.reduce(
                    (count, module) => count + module.lessons.filter((lesson) => lesson.completed).length,
                    0,
                )

                const totalLessons = modules.reduce((count, module) => count + module.lessons.length, 0)

                // Find the first incomplete lesson
                let foundIncomplete = false
                for (const module of modules) {
                    if (foundIncomplete) break

                    for (const lesson of module.lessons) {
                        if (!lesson.completed) {
                            setActiveLesson(lesson)
                            setCurrentModule(module.id)
                            foundIncomplete = true
                            break
                        }
                    }
                }

                // If all lessons are completed, set the last lesson as active
                if (!foundIncomplete) {
                    const lastModule = modules[modules.length - 1]
                    const lastLesson = lastModule.lessons[lastModule.lessons.length - 1]
                    setActiveLesson(lastLesson)
                    setCurrentModule(lastModule.id)
                }
            } catch (err) {
                console.error("Error:", err)
                setError("Failed to load course details")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseAndEnrollment()
    }, [courseId, user])

    const handleLessonClick = (moduleId: string, lesson: any) => {
        setCurrentModule(moduleId)
        setActiveLesson(lesson)
    }

    const markLessonComplete = async () => {
        if (!activeLesson || !enrollment) return

        // Find the lesson and mark it as completed
        const updatedModules = modules.map((module) => {
            if (module.id === currentModule) {
                return {
                    ...module,
                    lessons: module.lessons.map((lesson) => {
                        if (lesson.id === activeLesson.id) {
                            return { ...lesson, completed: true }
                        }
                        return lesson
                    }),
                }
            }
            return module
        })

        // Calculate new progress percentage
        const completedCount = updatedModules.reduce(
            (count, module) => count + module.lessons.filter((lesson) => lesson.completed).length,
            0,
        )

        const totalLessons = updatedModules.reduce((count, module) => count + module.lessons.length, 0)
        const newProgress = Math.round((completedCount / totalLessons) * 100)

        try {
            // Update enrollment progress in database
            const { error } = await supabase.from("enrollments").update({ progress: newProgress }).eq("id", enrollment.id)

            if (error) {
                console.error("Error updating progress:", error)
                toast.error("Failed to update progress")
                return
            }

            // Update local state
            setEnrollment({ ...enrollment, progress: newProgress })

            // Update active lesson in local state
            setActiveLesson({ ...activeLesson, completed: true })

            toast.success("Progress updated")

            // Find next lesson if available
            let foundNext = false
            let nextLesson = null
            let nextModule = currentModule

            for (const module of updatedModules) {
                if (foundNext) break

                if (module.id === currentModule || foundNext) {
                    for (const lesson of module.lessons) {
                        if (foundNext) {
                            nextLesson = lesson
                            nextModule = module.id
                            break
                        }

                        if (lesson.id === activeLesson.id) {
                            foundNext = true
                        }
                    }
                }
            }

            if (nextLesson && nextLesson.id !== activeLesson.id) {
                setActiveLesson(nextLesson)
                setCurrentModule(nextModule)
            }
        } catch (err) {
            console.error("Error:", err)
            toast.error("An unexpected error occurred")
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
                    <h2 className="text-3xl font-bold tracking-tight">Course Content</h2>
                    <p className="text-muted-foreground">Access your course materials</p>
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

    // Calculate progress
    const completedCount = modules.reduce(
        (count, module) => count + module.lessons.filter((lesson) => lesson.completed).length,
        0,
    )

    const totalLessons = modules.reduce((count, module) => count + module.lessons.length, 0)
    const progressPercentage = Math.round((completedCount / totalLessons) * 100)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{course?.title}</h2>
                <p className="text-muted-foreground">Level: {course?.level}</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Your Progress</CardTitle>
                            <CardDescription>Track your course completion</CardDescription>
                        </div>
                        <Badge variant={progressPercentage === 100 ? "default" : "outline"}>
                            {progressPercentage === 100 ? "Completed" : "In Progress"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="pt-2 flex justify-between text-sm text-muted-foreground">
                        <div>
                            <span className="font-medium text-foreground">{completedCount}</span> of {totalLessons} lessons completed
                        </div>
                        <div>
                            Estimated time remaining:{" "}
                            <span className="font-medium text-foreground">{(totalLessons - completedCount) * 20} min</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>
                                {totalLessons} lessons • {Math.round((totalLessons * 20) / 60)} hours
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Accordion type="single" collapsible defaultValue={currentModule || "module-1"}>
                                {modules.map((module) => (
                                    <AccordionItem key={module.id} value={module.id}>
                                        <AccordionTrigger className="px-4">
                                            <div className="text-left">
                                                <div>{module.title}</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {module.lessons.length} lessons •{module.lessons.filter((l) => l.completed).length} completed
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-0 pt-0">
                                            <div className="border-t">
                                                {module.lessons.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className={`flex items-center justify-between p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${activeLesson?.id === lesson.id ? "bg-muted" : ""
                                                            }`}
                                                        onClick={() => handleLessonClick(module.id, lesson)}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                {lesson.completed ? (
                                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                                ) : (
                                                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm">{lesson.title}</div>
                                                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                                    {lesson.type === "video" && <PlayCircle className="h-3 w-3 mr-1" />}
                                                                    {lesson.type === "reading" && <FileText className="h-3 w-3 mr-1" />}
                                                                    {lesson.type === "quiz" && (
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
                                                                            className="h-3 w-3 mr-1"
                                                                        >
                                                                            <path d="M9 11l3 3L22 4" />
                                                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                                                        </svg>
                                                                    )}
                                                                    {lesson.type === "exercise" && (
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
                                                                            className="h-3 w-3 mr-1"
                                                                        >
                                                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                                            <polyline points="14 2 14 8 20 8" />
                                                                            <path d="M8 13h8" />
                                                                            <path d="M8 17h8" />
                                                                            <path d="M8 9h1" />
                                                                        </svg>
                                                                    )}
                                                                    {lesson.type} • {lesson.duration}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{activeLesson?.title}</CardTitle>
                                    <CardDescription>{modules.find((m) => m.id === currentModule)?.title}</CardDescription>
                                </div>
                                <Badge variant="outline" className="capitalize">
                                    {activeLesson?.type}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Tabs defaultValue="content" className="h-full flex flex-col">
                                <TabsList>
                                    <TabsTrigger value="content">Content</TabsTrigger>
                                    <TabsTrigger value="notes">Notes</TabsTrigger>
                                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                </TabsList>
                                <TabsContent value="content" className="flex-1 mt-6">
                                    <div className="space-y-6">
                                        {activeLesson?.type === "video" && (
                                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                                <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
                                            </div>
                                        )}

                                        <div className="prose max-w-none dark:prose-invert">
                                            <h3>Lesson Content</h3>
                                            <p>
                                                This is a placeholder for the actual lesson content. In a complete implementation, this would
                                                display the specific content for the {activeLesson?.title} lesson.
                                            </p>
                                            <p>
                                                The content would include detailed explanations, examples, and interactive elements appropriate
                                                for a {course?.level} level English course.
                                            </p>

                                            {activeLesson?.type === "reading" && (
                                                <>
                                                    <h4>Reading Section</h4>
                                                    <p>
                                                        This section would contain reading materials, vocabulary lists, and grammar explanations
                                                        relevant to the current lesson.
                                                    </p>
                                                </>
                                            )}

                                            {activeLesson?.type === "quiz" && (
                                                <>
                                                    <h4>Quiz Questions</h4>
                                                    <p>
                                                        This section would contain multiple-choice questions, fill-in-the-blanks, and other
                                                        assessment elements to test your understanding of the material.
                                                    </p>
                                                </>
                                            )}

                                            {activeLesson?.type === "exercise" && (
                                                <>
                                                    <h4>Practice Exercises</h4>
                                                    <p>
                                                        This section would contain interactive exercises to help you practice the concepts covered
                                                        in this lesson.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="notes" className="flex-1">
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">Your Notes</h3>
                                        <p className="text-muted-foreground mb-4">
                                            You haven't added any notes for this lesson yet. Notes help you remember key concepts.
                                        </p>
                                        <Button variant="outline">Add Notes</Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="discussion" className="flex-1">
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
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
                                            className="h-12 w-12 text-muted-foreground mb-4"
                                        >
                                            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                                            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                                        </svg>
                                        <h3 className="text-lg font-medium mb-2">Discussion Forum</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Join the conversation with other students and instructors about this lesson.
                                        </p>
                                        <Button variant="outline">View Discussion</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="border-t pt-6 flex justify-between">
                            <Button variant="outline" asChild>
                                <a href="/dashboard/student/courses" className="flex items-center">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Courses
                                </a>
                            </Button>
                            <div className="flex gap-2">
                                {!activeLesson?.completed && <Button onClick={markLessonComplete}>Mark as Complete</Button>}
                                {activeLesson?.completed && (
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Completed
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

