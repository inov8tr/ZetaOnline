"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ArrowLeft, BookOpen, Calendar, Edit, Loader2, Mail, Shield, User, UserCog } from "lucide-react"
import Link from "next/link"

interface UserDetailsProps {
    params: {
        userId: string
    }
}

export default function UserDetailsPage({ params }: UserDetailsProps) {
    const { userId } = params
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [user, setUser] = useState<any>(null)
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        const fetchUserDetails = async () => {
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

                // Fetch user profile
                const { data: userData, error: userError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", userId)
                    .single()

                if (userError) {
                    console.error("Error fetching user:", userError)
                    setError("User not found")
                    setIsLoading(false)
                    return
                }

                setUser(userData)

                // Fetch user enrollments if they are a student
                if (userData.role === "student") {
                    const { data: enrollmentData, error: enrollmentError } = await supabase
                        .from("enrollments")
                        .select("*, courses(*)")
                        .eq("user_id", userId)

                    if (enrollmentError) {
                        console.error("Error fetching enrollments:", enrollmentError)
                    } else {
                        setEnrollments(enrollmentData || [])
                    }
                }
            } catch (err) {
                console.error("Error:", err)
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserDetails()
    }, [currentUser, userId])

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
                    <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
                    <p className="text-muted-foreground">View and manage user information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin/users">Back to Users</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
                    <p className="text-muted-foreground">View and manage user information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Not Found</CardTitle>
                        <CardDescription>The requested user could not be found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin/users">Back to Users</Link>
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
                    <h2 className="text-3xl font-bold tracking-tight">{user.display_name || "Unnamed User"}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/admin/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/dashboard/admin/users/${userId}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-primary">
                                {user.display_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold">{user.display_name || "Unnamed User"}</h3>
                        <div className="mt-2">
                            <Badge
                                variant="outline"
                                className={
                                    user.role === "admin"
                                        ? "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                                        : user.role === "teacher"
                                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                                            : "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                }
                            >
                                {user.role}
                            </Badge>
                        </div>
                        <div className="w-full mt-6 space-y-4">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                            {user.updated_at && (
                                <div className="flex items-center">
                                    <UserCog className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">Updated {new Date(user.updated_at).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-3">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Overview</span>
                            </TabsTrigger>
                            {user.role === "student" && (
                                <TabsTrigger value="courses" className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Courses</span>
                                </TabsTrigger>
                            )}
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span>Security</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Information</CardTitle>
                                    <CardDescription>Basic details about the user</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Full Name</h4>
                                                <p>{user.display_name || "Not provided"}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Email</h4>
                                                <p>{user.email}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Role</h4>
                                                <p className="capitalize">{user.role}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Status</h4>
                                                <p>Active</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Created</h4>
                                                <p>{new Date(user.created_at).toLocaleString()}</p>
                                            </div>
                                            {user.updated_at && (
                                                <div>
                                                    <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                                                    <p>{new Date(user.updated_at).toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Summary</CardTitle>
                                    <CardDescription>User's recent activity on the platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Activity tracking will be implemented in a future update.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {user.role === "student" && (
                            <TabsContent value="courses" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Enrolled Courses</CardTitle>
                                        <CardDescription>Courses the student is currently enrolled in</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {enrollments.length > 0 ? (
                                            <div className="space-y-4">
                                                {enrollments.map((enrollment) => (
                                                    <div key={enrollment.id} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium">{enrollment.courses?.title}</p>
                                                            <p className="text-sm text-muted-foreground">Level: {enrollment.courses?.level}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-sm">
                                                                <span className="font-medium">{enrollment.progress || 0}%</span> completed
                                                            </div>
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={`/dashboard/admin/courses/${enrollment.course_id}`}>View Course</Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>This student is not enrolled in any courses.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href={`/dashboard/admin/users/${userId}/enroll`}>Enroll in Course</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Test Results</CardTitle>
                                        <CardDescription>Student's performance in assessments</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No test results available for this student.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}

                        <TabsContent value="security" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>Manage user's security settings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">Password Reset</h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Send a password reset link to the user's email
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={async () => {
                                                    try {
                                                        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                                                            redirectTo: `${window.location.origin}/reset-password`,
                                                        })
                                                        if (error) {
                                                            toast.error(error.message)
                                                        } else {
                                                            toast.success("Password reset email sent")
                                                        }
                                                    } catch (err) {
                                                        console.error("Error sending reset email:", err)
                                                        toast.error("Failed to send password reset email")
                                                    }
                                                }}
                                            >
                                                Send Reset Link
                                            </Button>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-1">Account Status</h4>
                                            <p className="text-sm text-muted-foreground mb-2">Activate or deactivate this user account</p>
                                            <Button variant="outline">Deactivate Account</Button>
                                        </div>
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

