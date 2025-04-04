"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { BarChart, BookOpen, Search, Users } from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("classes")
    const [selectedClass, setSelectedClass] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Mock classes data
    const classes = [
        {
            id: "class-1",
            name: "Beginner English - Class A",
            course: "Beginner English",
            studentCount: 15,
            averageProgress: 68,
            startDate: "2025-01-15",
        },
        {
            id: "class-2",
            name: "Intermediate English - Class B",
            course: "Intermediate English",
            studentCount: 12,
            averageProgress: 72,
            startDate: "2025-02-01",
        },
        {
            id: "class-3",
            name: "Advanced English - Class C",
            course: "Advanced English",
            studentCount: 8,
            averageProgress: 85,
            startDate: "2025-02-15",
        },
    ]

    // Mock students data
    const students = [
        {
            id: "student-1",
            name: "John Smith",
            email: "john.smith@example.com",
            class: "Beginner English - Class A",
            classId: "class-1",
            progress: 75,
            lastActive: "2025-04-02",
        },
        {
            id: "student-2",
            name: "Emily Johnson",
            email: "emily.johnson@example.com",
            class: "Beginner English - Class A",
            classId: "class-1",
            progress: 82,
            lastActive: "2025-04-03",
        },
        {
            id: "student-3",
            name: "Michael Lee",
            email: "michael.lee@example.com",
            class: "Intermediate English - Class B",
            classId: "class-2",
            progress: 68,
            lastActive: "2025-04-01",
        },
        {
            id: "student-4",
            name: "Sarah Kim",
            email: "sarah.kim@example.com",
            class: "Intermediate English - Class B",
            classId: "class-2",
            progress: 90,
            lastActive: "2025-04-03",
        },
        {
            id: "student-5",
            name: "David Chen",
            email: "david.chen@example.com",
            class: "Advanced English - Class C",
            classId: "class-3",
            progress: 95,
            lastActive: "2025-04-02",
        },
    ]

    // Filter students based on selected class and search query
    const filteredStudents = students.filter(
        (student) =>
            (selectedClass === "all" || student.classId === selectedClass) &&
            (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Student Progress</h2>
                <p className="text-muted-foreground">Monitor your students' learning journey</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classes.length}</div>
                        <p className="text-xs text-muted-foreground">Active teaching assignments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(classes.reduce((total, cls) => total + cls.averageProgress, 0) / classes.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
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
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M8.21 13.89 7 23l-5-1 9.2-9.19a1.05 1.05 0 0 1 1.5 0l1.5 1.5a1.05 1.05 0 0 1 0 1.5l-9.19 9.19-1-5 9.19-9.19a1.05 1.05 0 0 1 1.5 0l1.5 1.5a1.05 1.05 0 0 1 0 1.5l-9.19 9.19" />
                            <path d="m23 6-4-4" />
                            <path d="M19 6a3 3 0 0 1 0 4l-1 1" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">
                            {students.reduce((top, student) => (student.progress > top.progress ? student : top), students[0]).name}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {
                                students.reduce((top, student) => (student.progress > top.progress ? student : top), students[0])
                                    .progress
                            }
                            % completion
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map((cls) => (
                            <Card key={cls.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{cls.name}</CardTitle>
                                            <CardDescription>{cls.course}</CardDescription>
                                        </div>
                                        <Badge variant="outline">{cls.studentCount} students</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Average Progress</span>
                                            <span className="font-medium">{cls.averageProgress}%</span>
                                        </div>
                                        <Progress value={cls.averageProgress} className="h-2" />
                                    </div>

                                    <div className="pt-2 text-sm text-muted-foreground">
                                        Started: {new Date(cls.startDate).toLocaleDateString()}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/dashboard/teacher/classes/${cls.id}/progress`}>View Detailed Progress</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-auto sm:min-w-[250px]"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Filter by class:</span>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {filteredStudents.length > 0 ? (
                        <div className="space-y-4">
                            {filteredStudents.map((student) => (
                                <Card key={student.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{student.name}</CardTitle>
                                                <CardDescription>{student.email}</CardDescription>
                                            </div>
                                            <Badge variant="outline">{student.class}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Course Progress</span>
                                                <span className="font-medium">{student.progress}%</span>
                                            </div>
                                            <Progress
                                                value={student.progress}
                                                className={`h-2 ${student.progress >= 80
                                                        ? "bg-green-500"
                                                        : student.progress >= 60
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                            />
                                        </div>

                                        <div className="pt-2 text-sm text-muted-foreground">
                                            Last active: {new Date(student.lastActive).toLocaleDateString()}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <Link href={`/dashboard/teacher/students/${student.id}`}>View Student Details</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Students Found</CardTitle>
                                <CardDescription>
                                    {searchQuery
                                        ? `No students match your search for "${searchQuery}"`
                                        : selectedClass !== "all"
                                            ? "No students in the selected class"
                                            : "No students found"}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

