import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Book, FileText, TestTube } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Student Dashboard',
};

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Here's an overview of your learning journey.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tests</CardTitle>
            <CardDescription>View your entrance and periodic test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Tests completed</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/student/tests" className="flex items-center">
                  <span>View Tests</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Courses</CardTitle>
            <CardDescription>Your enrolled courses and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Courses in progress</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/student/courses" className="flex items-center">
                  <span>View Courses</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Assignments</CardTitle>
            <CardDescription>Your pending and completed assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Pending assignments</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/student/assignments" className="flex items-center">
                  <span>View Assignments</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <TestTube className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed Entrance Test</p>
                  <p className="text-xs text-muted-foreground">Score: 85%</p>
                </div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
              <div className="flex items-center">
                <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Started Module 2: Advanced Concepts</p>
                  <p className="text-xs text-muted-foreground">Progress: 15%</p>
                </div>
                <div className="text-xs text-muted-foreground">1 week ago</div>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Submitted Assignment: Introduction</p>
                  <p className="text-xs text-muted-foreground">Grade: Pending</p>
                </div>
                <div className="text-xs text-muted-foreground">2 weeks ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Based on your learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Book className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Complete Module 1: Fundamentals</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 w-3/4 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <TestTube className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Take Periodic Test 1</p>
                  <p className="text-xs text-muted-foreground">Available now</p>
                </div>
                <Button size="sm" variant="outline">
                  Start
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
