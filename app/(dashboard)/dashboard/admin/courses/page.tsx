"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { BookOpen, Edit, Loader2, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react"
import Link from "next/link"

interface Course {
    id: string
    title: string
    description: string
    level: string
    created_at: string
    updated_at: string | null
    status?: string
}

export default function CoursesPage() {
    const { user } = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [levelFilter, setLevelFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const coursesPerPage = 10

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) return

            try {
                const { data: adminCheck, error: adminError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", user.id)
                    .single()

                if (adminError || adminCheck.role !== "admin") {
                    setError("You do not have permission to access this page")
                    setIsLoading(false)
                    return
                }

                const { data, error: fetchError } = await supabase
                    .from("courses")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (fetchError) {
                    setError("Failed to load courses")
                    return
                }

                const coursesWithStatus = data.map((course: Course) => ({
                    ...course,
                    status: "active",
                }))

                setCourses(coursesWithStatus)
                setFilteredCourses(coursesWithStatus)
                setTotalPages(Math.ceil(coursesWithStatus.length / coursesPerPage))
            } catch (err) {
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourses()
    }, [user])

    useEffect(() => {
        let result = [...courses]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter((course: Course) =>
                course.title.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query)
            )
        }

        if (levelFilter !== "all") {
            result = result.filter((course: Course) => course.level === levelFilter)
        }

        if (statusFilter !== "all") {
            result = result.filter((course: Course) => course.status === statusFilter)
        }

        setFilteredCourses(result)
        setTotalPages(Math.ceil(result.length / coursesPerPage))
        setCurrentPage(1)
    }, [searchQuery, levelFilter, statusFilter, courses])

    const getCurrentPageCourses = () => {
        const startIndex = (currentPage - 1) * coursesPerPage
        return filteredCourses.slice(startIndex, startIndex + coursesPerPage)
    }

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return

        try {
            const { error } = await supabase.from("courses").delete().eq("id", courseId)

            if (error) {
                toast.error("Failed to delete course")
                return
            }

            setCourses(courses.filter((course: Course) => course.id !== courseId))
            toast.success("Course deleted successfully")
        } catch (err) {
            toast.error("An unexpected error occurred")
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    if (error) {
        return (
            <div className="space-y-8">
                <h2 className="text-3xl font-bold">Course Management</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin">Back to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <div className="text-sm">[Truncated UI rendering for brevity]</div>
}
