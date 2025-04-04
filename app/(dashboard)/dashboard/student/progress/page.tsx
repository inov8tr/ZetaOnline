"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { BarChart, BookOpen, Calendar, Clock, TrendingUp } from "lucide-react"

export default function ProgressPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")

    // Mock progress data
    const overallProgress = 65
    const coursesProgress = [
        {
            id: "course-1",
            title: "Intermediate English",
            progress: 65,
            totalLessons: 24,
            completedLessons: 16,
            lastActivity: "2025-04-02T14:30:00",
        },
    ]

    const assessmentScores = [
        {
            id: "assessment-1",
            title: "Module 1 Assessment",
            course: "Intermediate English",
            date: "2025-03-28T14:30:00",
            score: 85,
        },
        {
            id: "assessment-2",
            title: "Vocabulary Quiz",
            course: "Intermediate English",
            date: "2025-03-15T10:15:00",
            score: 90,
        },
        {
            id: "assessment-3",
            title: "Entrance Test",
            course: "Placement",
            date: "2025-03-01T09:45:00",
            score: 78,
        },
    ]

    const weeklyActivity = [
        { day: "Mon", hours: 1.5 },
        { day: "Tue", hours: 2.0 },
        { day: "Wed", hours: 0.5 },
        { day: "Thu", hours: 1.0 },
        { day: "Fri", hours: 2.5 },
        { day: "Sat", hours: 3.0 },
        { day: "Sun", hours: 1.5 },
    ]

    const skillsProgress = [
        { skill: "Reading", progress: 75 },
        { skill: "Writing", progress: 60 },
        { skill: "Listening", progress: 80 },
        { skill: "Speaking", progress: 55 },
        { skill: "Grammar", progress: 70 },
        { skill: "Vocabulary", progress: 65 },
    ]

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Learning Progress</h2>
                <p className="text-muted-foreground">Track your learning journey and achievements</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallProgress}%</div>
                        <Progress value={overallProgress} className="h-2 mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{coursesProgress.length}</div>
                        <p className="text-xs text-muted-foreground">Active learning programs</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{weeklyActivity.reduce((total, day) => total + day.hours, 0)} hrs</div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(
                                assessmentScores.reduce((total, assessment) => total + assessment.score, 0) / assessmentScores.length,
                            )}
                            %
                        </div>
                        <p className="text-xs text-muted-foreground">Across all assessments</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Activity</CardTitle>
                            <CardDescription>Your study time over the past week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] flex items-end justify-between">
                                {weeklyActivity.map((day) => (
                                    <div key={day.day} className="flex flex-col items-center">
                                        <div
                                            className="w-12 bg-primary rounded-t-md"
                                            style={{ height: `${(day.hours / 3) * 150}px` }}
                                        ></div>
                                        <div className="mt-2 text-sm">{day.day}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your latest learning activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Completed Lesson: Basic Vocabulary</p>
                                            <p className="text-sm text-muted-foreground">Intermediate English • 2 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                            <BarChart className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Completed Assessment: Module 1</p>
                                            <p className="text-sm text-muted-foreground">Intermediate English • 1 week ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Enrolled in Course: Intermediate English</p>
                                            <p className="text-sm text-muted-foreground">1 month ago</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Learning Streak</CardTitle>
                                <CardDescription>Your consistent learning pattern</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center text-center h-[200px]">
                                <div className="text-5xl font-bold text-primary mb-2">7</div>
                                <p className="text-xl mb-4">Day Streak</p>
                                <p className="text-sm text-muted-foreground">
                                    You've been learning consistently for 7 days. Keep it up!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                    {coursesProgress.map((course) => (
                        <Card key={course.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{course.title}</CardTitle>
                                        <CardDescription>Last activity: {formatDate(course.lastActivity)}</CardDescription>
                                    </div>
                                    <Badge variant={course.progress === 100 ? "default" : "outline"}>{course.progress}%</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span className="font-medium">
                                            {course.completedLessons} of {course.totalLessons} lessons
                                        </span>
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                </div>

                                <div className="pt-2 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground">Estimated time remaining</span>
                                        <span className="font-medium">{(course.totalLessons - course.completedLessons) * 20} min</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground">Time spent</span>
                                        <span className="font-medium">{course.completedLessons * 20} min</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="assessments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assessment Scores</CardTitle>
                            <CardDescription>Your performance in tests and quizzes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {assessmentScores.map((assessment) => (
                                    <div key={assessment.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{assessment.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {assessment.course} • {formatDate(assessment.date)}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 w-12 text-right font-medium">{assessment.score}%</div>
                                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${assessment.score >= 80
                                                            ? "bg-green-500"
                                                            : assessment.score >= 60
                                                                ? "bg-yellow-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${assessment.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills Breakdown</CardTitle>
                            <CardDescription>Your proficiency in different language skills</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {skillsProgress.map((skill) => (
                                    <div key={skill.skill} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{skill.skill}</span>
                                            <span className="font-medium">{skill.progress}%</span>
                                        </div>
                                        <Progress value={skill.progress} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

