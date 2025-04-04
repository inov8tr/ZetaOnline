"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Clock, FileText } from "lucide-react"
import Link from "next/link"

export default function AssessmentsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("upcoming")

    // Mock assessment data
    const upcomingAssessments = [
        {
            id: "assessment-1",
            title: "Module 2 Assessment",
            course: "Intermediate English",
            dueDate: "2025-04-15T23:59:59",
            duration: "30 min",
            questions: 25,
            status: "not-started",
        },
        {
            id: "assessment-2",
            title: "Grammar Proficiency Test",
            course: "Intermediate English",
            dueDate: "2025-04-20T23:59:59",
            duration: "45 min",
            questions: 40,
            status: "not-started",
        },
    ]

    const pastAssessments = [
        {
            id: "assessment-3",
            title: "Module 1 Assessment",
            course: "Intermediate English",
            completedDate: "2025-03-28T14:30:00",
            duration: "30 min",
            questions: 25,
            score: 85,
            status: "completed",
        },
        {
            id: "assessment-4",
            title: "Vocabulary Quiz",
            course: "Intermediate English",
            completedDate: "2025-03-15T10:15:00",
            duration: "20 min",
            questions: 20,
            score: 90,
            status: "completed",
        },
        {
            id: "assessment-5",
            title: "Entrance Test",
            course: "Placement",
            completedDate: "2025-03-01T09:45:00",
            duration: "60 min",
            questions: 50,
            score: 78,
            status: "completed",
        },
    ]

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Calculate days remaining
    const getDaysRemaining = (dueDate: string) => {
        const now = new Date()
        const due = new Date(dueDate)
        const diffTime = due.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return "Due today"
        } else if (diffDays === 1) {
            return "Due tomorrow"
        } else {
            return `${diffDays} days remaining`
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Assessments</h2>
                <p className="text-muted-foreground">View and take your course assessments and tests</p>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past Assessments</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcomingAssessments.length > 0 ? (
                        <div className="grid gap-4">
                            {upcomingAssessments.map((assessment) => (
                                <Card key={assessment.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{assessment.title}</CardTitle>
                                                <CardDescription>{assessment.course}</CardDescription>
                                            </div>
                                            <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                                                {getDaysRemaining(assessment.dueDate)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>Duration: {assessment.duration}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>{assessment.questions} questions</span>
                                            </div>
                                            <div className="flex items-center">
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
                                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                                >
                                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                                    <line x1="16" x2="16" y1="2" y2="6" />
                                                    <line x1="8" x2="8" y1="2" y2="6" />
                                                    <line x1="3" x2="21" y1="10" y2="10" />
                                                    <path d="M8 14h.01" />
                                                    <path d="M12 14h.01" />
                                                    <path d="M16 14h.01" />
                                                    <path d="M8 18h.01" />
                                                    <path d="M12 18h.01" />
                                                    <path d="M16 18h.01" />
                                                </svg>
                                                <span>Due: {formatDate(assessment.dueDate)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <Link href={`/dashboard/student/assessments/${assessment.id}`}>Start Assessment</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Upcoming Assessments</CardTitle>
                                <CardDescription>You don't have any upcoming assessments at the moment.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Assessments will appear here when they are assigned to you as part of your courses.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {pastAssessments.length > 0 ? (
                        <div className="grid gap-4">
                            {pastAssessments.map((assessment) => (
                                <Card key={assessment.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{assessment.title}</CardTitle>
                                                <CardDescription>{assessment.course}</CardDescription>
                                            </div>
                                            <Badge
                                                variant={assessment.score >= 80 ? "default" : assessment.score >= 60 ? "secondary" : "outline"}
                                                className={assessment.score >= 80 ? "bg-green-600" : ""}
                                            >
                                                {assessment.score}%
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>Duration: {assessment.duration}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>{assessment.questions} questions</span>
                                            </div>
                                            <div className="flex items-center">
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
                                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                                >
                                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                                    <line x1="16" x2="16" y1="2" y2="6" />
                                                    <line x1="8" x2="8" y1="2" y2="6" />
                                                    <line x1="3" x2="21" y1="10" y2="10" />
                                                    <path d="M8 14h.01" />
                                                    <path d="M12 14h.01" />
                                                    <path d="M16 14h.01" />
                                                    <path d="M8 18h.01" />
                                                    <path d="M12 18h.01" />
                                                    <path d="M16 18h.01" />
                                                </svg>
                                                <span>Completed: {formatDate(assessment.completedDate)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href={`/dashboard/student/assessments/${assessment.id}/results`}>View Results</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Past Assessments</CardTitle>
                                <CardDescription>You haven't completed any assessments yet.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Once you complete assessments, they will appear here for your reference.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

