import { CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Users, UserPlus, BarChart } from "lucide-react"

export default async function AdminDashboardPage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    // Get admin profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

    // Verify admin role
    if (profile?.role !== "admin") {
        redirect("/dashboard/student")
    }

    // Get counts for dashboard
    const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    const { count: courseCount } = await supabase.from("courses").select("*", { count: "exact", head: true })

    const { count: classCount } = await supabase.from("classes").select("*", { count: "exact", head: true })

    // Get recent users
    const { data: recentUsers } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {profile?.display_name || "Admin"}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Students, teachers, and admins</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courseCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Available courses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
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
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Ongoing classes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Users</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {recentUsers?.filter((u) => {
                                const createdDate = new Date(u.created_at)
                                const now = new Date()
                                const diffTime = Math.abs(now.getTime() - createdDate.getTime())
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                return diffDays <= 30
                            }).length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">In the last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                        <CardDescription>Newly registered users on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentUsers && recentUsers.length > 0 ? (
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                                <span className="font-medium text-primary">
                                                    {user.display_name?.substring(0, 2).toUpperCase() ||
                                                        user.email?.substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.display_name || "Unnamed User"}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{user.role}</Badge>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/dashboard/admin/users/${user.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="mb-4 text-muted-foreground">No recent users found.</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/admin/users">View All Users</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/admin/users/create">
                                    <UserPlus className="h-6 w-6 mb-2" />
                                    <span>Add User</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/admin/courses/create">
                                    <BookOpen className="h-6 w-6 mb-2" />
                                    <span>Add Course</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/admin/classes/create">
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
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    <span>Create Class</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                                <Link href="/dashboard/admin/analytics">
                                    <BarChart className="h-6 w-6 mb-2" />
                                    <span>Analytics</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>Current platform status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Database</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                    Operational
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Authentication</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                    Operational
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Storage</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                    Operational
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">API</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                    Operational
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                    <UserPlus className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">New User Registration</p>
                                    <p className="text-sm text-muted-foreground">Sarah Johnson joined as a student</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">New Course Added</p>
                                    <p className="text-sm text-muted-foreground">Advanced Business English course created</p>
                                    <p className="text-xs text-muted-foreground">1 day ago</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 rounded-full bg-primary/10 p-2">
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
                                        className="h-4 w-4 text-primary"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">New Class Created</p>
                                    <p className="text-sm text-muted-foreground">Intermediate English - Class D started</p>
                                    <p className="text-xs text-muted-foreground">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

