"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function ProfilePage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [profile, setProfile] = useState({
        display_name: "",
        email: "",
        phone: "",
        bio: "",
    })

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .single()

                if (error) {
                    console.error("Error fetching profile:", error)
                    return
                }

                setProfile({
                    display_name: data.display_name || "",
                    email: user.email || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                })
            } catch (err) {
                console.error("Error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    const handleProfileChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setProfile((prev) => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({ ...prev, [name]: value }))
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)
        setSuccess(null)

        if (!user) return

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    display_name: profile.display_name,
                    phone: profile.phone,
                    bio: profile.bio,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", user.id)

            if (error) {
                setError(error.message)
                toast.error("Failed to update profile")
            } else {
                setSuccess("Profile updated successfully")
                toast.success("Profile updated successfully")
                setTimeout(() => {
                    setSuccess(null)
                }, 3000)
            }
        } catch (err) {
            console.error("Error updating profile:", err)
            setError("An unexpected error occurred")
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)
        setSuccess(null)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match")
            setIsSaving(false)
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError("Password must be at least 6 characters")
            setIsSaving(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword,
            })

            if (error) {
                setError(error.message)
                toast.error(error.message)
            } else {
                setSuccess("Password updated successfully")
                toast.success("Password updated successfully")
                setPasswordData({
                    newPassword: "",
                    confirmPassword: "",
                })
                setTimeout(() => {
                    setSuccess(null)
                }, 3000)
            }
        } catch (err) {
            console.error("Error updating password:", err)
            setError("An unexpected error occurred")
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <Card className="md:w-1/3">
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>
                            This is how others will see you on the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src="" alt={profile.display_name} />
                            <AvatarFallback className="text-3xl">
                                {profile.display_name.substring(0, 2).toUpperCase() ||
                                    user?.email?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold">{profile.display_name}</h3>
                        <p className="text-muted-foreground">{profile.email}</p>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground">Student</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex-1">
                    <Tabs defaultValue="general">
                        <TabsList className="mb-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Information</CardTitle>
                                    <CardDescription>
                                        Update your personal information
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={handleProfileSubmit}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="display_name">Full Name</Label>
                                            <Input
                                                id="display_name"
                                                name="display_name"
                                                value={profile.display_name}
                                                onChange={handleProfileChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                value={profile.email}
                                                disabled
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Email cannot be changed
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleProfileChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <textarea
                                                id="bio"
                                                name="bio"
                                                value={profile.bio}
                                                onChange={handleProfileChange}
                                                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                                            />
                                        </div>

                                        {error && (
                                            <div className="rounded-lg bg-red-50 p-4">
                                                <div className="flex">
                                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                                    <div className="ml-3 text-sm text-red-700">
                                                        {error}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="rounded-lg bg-green-50 p-4">
                                                <div className="flex">
                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                    <div className="ml-3 text-sm text-green-700">
                                                        {success}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>

                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your password</CardDescription>
                                </CardHeader>
                                <form onSubmit={handlePasswordSubmit}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>

                                        {error && (
                                            <div className="rounded-lg bg-red-50 p-4">
                                                <div className="flex">
                                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                                    <div className="ml-3 text-sm text-red-700">
                                                        {error}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="rounded-lg bg-green-50 p-4">
                                                <div className="flex">
                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                    <div className="ml-3 text-sm text-green-700">
                                                        {success}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? "Updating..." : "Update Password"}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
