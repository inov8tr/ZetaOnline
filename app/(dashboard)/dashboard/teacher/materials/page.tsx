"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, FileText, FolderPlus, Search, Upload } from "lucide-react"
import Link from "next/link"

export default function MaterialsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("lessons")
    const [searchQuery, setSearchQuery] = useState("")

    // Mock materials data
    const lessons = [
        {
            id: "lesson-1",
            title: "Introduction to English Grammar",
            level: "Beginner",
            type: "Lesson",
            lastUpdated: "2025-03-28",
            status: "published",
        },
        {
            id: "lesson-2",
            title: "Basic Vocabulary: Everyday Objects",
            level: "Beginner",
            type: "Lesson",
            lastUpdated: "2025-03-25",
            status: "published",
        },
        {
            id: "lesson-3",
            title: "Intermediate Conversation Skills",
            level: "Intermediate",
            type: "Lesson",
            lastUpdated: "2025-03-20",
            status: "published",
        },
        {
            id: "lesson-4",
            title: "Advanced Writing Techniques",
            level: "Advanced",
            type: "Lesson",
            lastUpdated: "2025-03-15",
            status: "draft",
        },
    ]

    const resources = [
        {
            id: "resource-1",
            title: "English Pronunciation Guide",
            level: "All Levels",
            type: "PDF",
            lastUpdated: "2025-03-10",
            status: "published",
        },
        {
            id: "resource-2",
            title: "Vocabulary Flashcards",
            level: "Beginner",
            type: "ZIP",
            lastUpdated: "2025-03-05",
            status: "published",
        },
        {
            id: "resource-3",
            title: "Grammar Exercises Workbook",
            level: "Intermediate",
            type: "PDF",
            lastUpdated: "2025-02-28",
            status: "published",
        },
        {
            id: "resource-4",
            title: "Listening Comprehension Audio Files",
            level: "All Levels",
            type: "MP3",
            lastUpdated: "2025-02-20",
            status: "published",
        },
    ]

    // Filter materials based on search query
    const filteredLessons = lessons.filter(
        (lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.level.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredResources = resources.filter(
        (resource) =>
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Course Materials</h2>
                    <p className="text-muted-foreground">Manage your teaching resources and lesson content</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/teacher/materials/create">
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Create Material
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="lessons" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Lessons</span>
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Resources</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="lessons" className="space-y-4">
                    {filteredLessons.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredLessons.map((lesson) => (
                                <Card key={lesson.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{lesson.title}</CardTitle>
                                                <CardDescription>Level: {lesson.level}</CardDescription>
                                            </div>
                                            <Badge variant={lesson.status === "published" ? "default" : "outline"}>
                                                {lesson.status === "published" ? "Published" : "Draft"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Last updated: {new Date(lesson.lastUpdated).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/materials/${lesson.id}/preview`}>Preview</Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <Link href={`/dashboard/teacher/materials/${lesson.id}/edit`}>Edit</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Lessons Found</CardTitle>
                                <CardDescription>
                                    {searchQuery
                                        ? `No lessons match your search for "${searchQuery}"`
                                        : "You haven't created any lessons yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button asChild>
                                    <Link href="/dashboard/teacher/materials/create">Create Lesson</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                    {filteredResources.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredResources.map((resource) => (
                                <Card key={resource.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{resource.title}</CardTitle>
                                                <CardDescription>Level: {resource.level}</CardDescription>
                                            </div>
                                            <Badge variant="outline">{resource.type}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Last updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/teacher/materials/${resource.id}/download`}>Download</Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <Link href={`/dashboard/teacher/materials/${resource.id}/edit`}>Edit</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Resources Found</CardTitle>
                                <CardDescription>
                                    {searchQuery
                                        ? `No resources match your search for "${searchQuery}"`
                                        : "You haven't uploaded any resources yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Resource
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

