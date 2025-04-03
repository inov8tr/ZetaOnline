import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, GraduationCap, LineChart } from "lucide-react"

export default async function StudentDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

  // Get user's enrolled courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("user_id", session.user.id)

  // Get user's test results
  const { data: testResults } = await supabase
    .from("test_results")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(1)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {profile?.display_name || "Student"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active learning programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments && enrollments.length > 0
                ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrollments.length)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Test Score</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults && testResults.length > 0 ? testResults[0].score : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {testResults && testResults.length > 0
                ? `Level: ${testResults[0].level_recommendation}`
                : "No tests taken yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Your currently enrolled courses and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments && enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{enrollment.courses?.title}</p>
                      <p className="text-sm text-muted-foreground">Level: {enrollment.courses?.level}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{enrollment.progress || 0}%</div>
                      <div className="h-2 w-24 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="mb-4 text-muted-foreground">You are not enrolled in any courses yet.</p>
                <Button asChild>
                  <Link href="/entrance-test">Take Entrance Test</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
            <CardDescription>Personalized recommendations for your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!testResults || testResults.length === 0 ? (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Take the Entrance Test</p>
                      <p className="text-sm text-muted-foreground">
                        Find out your current English level and get personalized course recommendations
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm">
                      <Link href="/entrance-test">Start Test</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Enroll in {testResults[0].level_recommendation} Course</p>
                      <p className="text-sm text-muted-foreground">
                        Based on your test results, we recommend our {testResults[0].level_recommendation} level course
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm">
                      <Link href={`/program/${testResults[0].level_recommendation.toLowerCase()}`}>View Course</Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Complete Your Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Update your profile information to get a more personalized experience
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard/student/profile">Update Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

