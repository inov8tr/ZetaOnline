import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default async function TeacherClassesPage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    // Get teacher's classes
    const { data: classes } = await supabase.from("classes").select("*, courses(*)").eq("teacher_id", session.user.id)

    // Get student counts for each class
    const classIds = classes?.map((cls) => cls.id) || []
    const { data: enrollmentCounts } = await supabase.rpc("get_enrollment_counts_by_class", {
        class_ids: classIds,
    })

    // Map enrollment counts to classes
    const classesWithCounts = classes?.map((cls) => {
        const countData = enrollmentCounts?.find(
            (count: { class_id: string; count: number }) => count.class_id === cls.id
        )
        return {
            ...cls,
            studentCount: countData?.count || 0,
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
                    <p className="text-muted-foreground">Manage your teaching assignments and students</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/teacher/classes/create">Create Class</Link>
                </Button>
            </div>

            {classesWithCounts && classesWithCounts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classesWithCounts.map((cls) => (
                        <Card key={cls.id} className="overflow-hidden">
                            <div className="h-2 bg-primary" />
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{cls.name}</CardTitle>
                                        <CardDescription>{cls.courses?.title}</CardDescription>
                                    </div>
                                    <Badge variant={cls.status === "active" ? "default" : "outline"}>{cls.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                                        <span>{cls.studentCount} students</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">{cls.schedule || "Flexible schedule"}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {cls.description || cls.courses?.description || "No description available."}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/dashboard/teacher/classes/${cls.id}/students`}>View Students</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={`/dashboard/teacher/classes/${cls.id}`}>Manage Class</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Classes Assigned</CardTitle>
                        <CardDescription>
                            You are not currently assigned to any classes. Create a new class or contact an administrator.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild>
                            <Link href="/dashboard/teacher/classes/create">Create Class</Link>
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
