"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Search, UserPlus } from "lucide-react"
import Link from "next/link"

interface EnrollStudentsProps {
    params: {
        courseId: string
    }
}

export default function EnrollStudentsPage({ params }: EnrollStudentsProps) {
    const { courseId } = params
    const router = useRouter()
    const { user: currentUser } = useAuth()

    const [course, setCourse] = useState<any>(null)
    const [students, setStudents] = useState<any[]>([])
    const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>([])
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isEnrolling, setIsEnrolling] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return

            try {
                const { data: adminCheck, error: adminError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", currentUser.id)
                    .single()

                if (adminError || adminCheck.role !== "admin") {
                    setError("You do not have permission to access this page")
                    return setIsLoading(false)
                }

                const { data: courseData, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", courseId)
                    .single()

                if (courseError) {
                    setError("Course not found")
                    return setIsLoading(false)
                }

                setCourse(courseData)

                const { data: studentsData, error: studentsError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("role", "student")
                    .order("display_name", { ascending: true })

                if (studentsError) {
                    setError("Failed to load students")
                    return setIsLoading(false)
                }

                setStudents(studentsData || [])

                const { data: enrollmentsData, error: enrollmentsError } = await supabase
                    .from("enrollments")
                    .select("user_id")
                    .eq("course_id", courseId)

                if (!enrollmentsError) {
                    const enrolledIds = enrollmentsData?.map(
                        (enrollment: { user_id: string }) => enrollment.user_id
                    ) || []
                    setEnrolledStudentIds(enrolledIds)
                }
            } catch (err) {
                console.error("Error:", err)
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [currentUser, courseId])

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            searchQuery === "" ||
            (student.display_name &&
                student.display_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesSearch
    })

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudentIds((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
        )
    }

    const handleSelectAll = () => {
        const selectable = filteredStudents.filter(
            (s) => !enrolledStudentIds.includes(s.user_id)
        )
        if (selectedStudentIds.length === selectable.length) {
            setSelectedStudentIds([])
        } else {
            setSelectedStudentIds(selectable.map((s) => s.user_id))
        }
    }

    const handleEnrollStudents = async () => {
        if (selectedStudentIds.length === 0) {
            toast.error("Please select at least one student to enroll")
            return
        }

        setIsEnrolling(true)

        try {
            const enrollments = selectedStudentIds.map((user_id) => ({
                user_id,
                course_id: courseId,
                status: "active",
                progress: 0,
            }))

            const { error } = await supabase.from("enrollments").insert(enrollments)

            if (error) {
                toast.error("Failed to enroll students")
            } else {
                toast.success(`Successfully enrolled ${selectedStudentIds.length} students`)
                router.push(`/dashboard/admin/courses/${courseId}?tab=students`)
            }
        } catch (err) {
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

    if (error) {
        return (
            <div className="space-y-8">
                <h2 className="text-3xl font-bold">Enroll Students</h2>
                <p className="text-muted-foreground">Add students to this course</p>
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href={`/dashboard/admin/courses/${courseId}`}>Back to Course</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold">Enroll Students</h2>
                <p className="text-muted-foreground">Add students to {course?.title}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Students to Enroll</CardTitle>
                    <CardDescription>Choose students to add to this course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                selectedStudentIds.length > 0 &&
                                                selectedStudentIds.length ===
                                                filteredStudents.filter((s) => !enrolledStudentIds.includes(s.user_id)).length
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student: any) => {
                                        const isEnrolled = enrolledStudentIds.includes(student.user_id)
                                        return (
                                            <TableRow key={student.user_id}>
                                                <TableCell>
                                                    {isEnrolled ? (
                                                        <div className="h-4 w-4 text-center text-green-500">✓</div>
                                                    ) : (
                                                        <Checkbox
                                                            checked={selectedStudentIds.includes(student.user_id)}
                                                            onCheckedChange={() => handleSelectStudent(student.user_id)}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>{student.display_name || "Unnamed"}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>
                                                    {isEnrolled ? (
                                                        <span className="text-green-600">Enrolled</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Not enrolled</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6">
                                            No students found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/admin/courses/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <Button
                        onClick={handleEnrollStudents}
                        disabled={isEnrolling || selectedStudentIds.length === 0}
                    >
                        {isEnrolling ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enrolling...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Enroll Selected
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
