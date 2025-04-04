import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react"

export default async function TeacherDashboardPage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    // Get teacher profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

    // Get teacher's classes
    const { data: classes } = await supabase.from("classes").select("*, courses(*)").eq("teacher_id", session.user.id)

    // Get total student count
    const { data: enrollments, count: studentCount } = await supabase
        .from("enrollments")
        .select("user_id", { count: "exact" })
        .in("class_id", classes?.map((c) => c.id) || [])

    // Get recent submissions
    const { data: submissions } = await supabase
        .from("submissions")
        .select("*, profiles(display_name), assessments(title)")
        .in("class_id", classes?.map((c) => c.id) || [])
        .order("created_at", { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {profile?.display_name || "Teacher"}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classes?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Active teaching assignments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{studentCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Across all classes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Assignments to grade</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24h</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Your Classes</CardTitle>
                        <CardDescription>Manage your teaching assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {classes && classes.length > 0 ? (
                            <div className="space-y-4">
                                {classes.map((cls) => (
                                    <div key={cls.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{cls.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {cls.courses?.title} • {cls.schedule || "Flexible schedule"}
                                            </p>
                                        </div>
                                        <Button asChild size="sm">
                                            <Link href={`/dashboard/teacher/classes/${cls.id}`}>Manage</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="mb-4 text-muted-foreground">You are not assigned to any classes yet.</p>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/teacher/classes">View All Classes</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Submissions</CardTitle>
                        <CardDescription>Latest student work that needs your attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submissions && submissions.length > 0 ? (
                            <div className="space-y-4">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="flex items-start">
                                        <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                            <GraduationCap className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{submission.profiles?.display_name}</p>
                                            <p className="text-sm text-muted-foreground">Submitted: {submission.assessments?.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(submission.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="mb-4 text-muted-foreground">No recent submissions to review.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Schedule</CardTitle>
                        <CardDescription>Your teaching schedule for the week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Intermediate English - Class A</p>
                                    <p className="text-sm text-muted-foreground">Monday, 10:00 AM - 11:30 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Beginner English - Class C</p>
                                    <p className="text-sm text-muted-foreground">Tuesday, 2:00 PM - 3:30 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Advanced English - Class B</p>
                                    <p className="text-sm text-muted-foreground">Thursday, 1:00 PM - 2:30 PM</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks for teachers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/teacher/materials">
                                    <BookOpen className="h-6 w-6 mb-2" />
                                    <span>Course Materials</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/teacher/assessments">
                                    <GraduationCap className="h-6 w-6 mb-2" />
                                    <span>Assessments</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/teacher/progress">
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
                                    <span>Student Progress</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/teacher/messages">
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
                                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                                    </svg>
                                    <span>Messages</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

