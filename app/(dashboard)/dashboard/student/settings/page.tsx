"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Bell, Globe, Moon, Shield } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
    const { setTheme, theme } = useTheme()
    const [isSaving, setIsSaving] = useState(false)

    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            marketing: false,
            updates: true,
        },
        appearance: {
            theme: theme || "system",
            fontSize: "medium",
            reducedMotion: false,
        },
        language: {
            preferred: "en",
            showTranslations: true,
        },
        privacy: {
            profileVisibility: "public",
            activityVisibility: "friends",
            showOnlineStatus: true,
        },
    })

    const handleNotificationChange = (key: keyof typeof settings.notifications) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key],
            },
        }))
    }

    const handleAppearanceChange = (key: keyof typeof settings.appearance, value: any) => {
        if (key === "theme") {
            setTheme(value)
        }

        setSettings((prev) => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                [key]: value,
            },
        }))
    }

    const handleLanguageChange = (key: keyof typeof settings.language, value: any) => {
        setSettings((prev) => ({
            ...prev,
            language: {
                ...prev.language,
                [key]: key === "showTranslations" ? !prev.language.showTranslations : value,
            },
        }))
    }

    const handlePrivacyChange = (key: keyof typeof settings.privacy, value: any) => {
        setSettings((prev) => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [key]: key === "showOnlineStatus" ? !prev.privacy.showOnlineStatus : value,
            },
        }))
    }

    const handleSaveSettings = () => {
        setIsSaving(true)

        // Simulate saving settings
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Settings saved successfully")
        }, 1000)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="notifications" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span className="hidden sm:inline">Appearance</span>
                    </TabsTrigger>
                    <TabsTrigger value="language" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">Language</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Privacy</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Configure how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={settings.notifications.email}
                                    onCheckedChange={() => handleNotificationChange("email")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                                </div>
                                <Switch
                                    id="push-notifications"
                                    checked={settings.notifications.push}
                                    onCheckedChange={() => handleNotificationChange("push")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                                </div>
                                <Switch
                                    id="marketing-notifications"
                                    checked={settings.notifications.marketing}
                                    onCheckedChange={() => handleNotificationChange("marketing")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="update-notifications">Product Updates</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications about product updates</p>
                                </div>
                                <Switch
                                    id="update-notifications"
                                    checked={settings.notifications.updates}
                                    onCheckedChange={() => handleNotificationChange("updates")}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>Customize how the application looks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <Select
                                    value={settings.appearance.theme}
                                    onValueChange={(value) => handleAppearanceChange("theme", value)}
                                >
                                    <SelectTrigger id="theme">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="font-size">Font Size</Label>
                                <Select
                                    value={settings.appearance.fontSize}
                                    onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                                >
                                    <SelectTrigger id="font-size">
                                        <SelectValue placeholder="Select font size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                                    <p className="text-sm text-muted-foreground">Reduce the amount of animations</p>
                                </div>
                                <Switch
                                    id="reduced-motion"
                                    checked={settings.appearance.reducedMotion}
                                    onCheckedChange={(checked) => handleAppearanceChange("reducedMotion", checked)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="language">
                    <Card>
                        <CardHeader>
                            <CardTitle>Language Settings</CardTitle>
                            <CardDescription>Configure language preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="preferred-language">Preferred Language</Label>
                                <Select
                                    value={settings.language.preferred}
                                    onValueChange={(value) => handleLanguageChange("preferred", value)}
                                >
                                    <SelectTrigger id="preferred-language">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="ko">Korean</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="show-translations">Show Translations</Label>
                                    <p className="text-sm text-muted-foreground">Show translation options for content</p>
                                </div>
                                <Switch
                                    id="show-translations"
                                    checked={settings.language.showTranslations}
                                    onCheckedChange={() => handleLanguageChange("showTranslations", null)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>Manage your privacy preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                                <Select
                                    value={settings.privacy.profileVisibility}
                                    onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                                >
                                    <SelectTrigger id="profile-visibility">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="friends">Friends Only</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="activity-visibility">Activity Visibility</Label>
                                <Select
                                    value={settings.privacy.activityVisibility}
                                    onValueChange={(value) => handlePrivacyChange("activityVisibility", value)}
                                >
                                    <SelectTrigger id="activity-visibility">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="friends">Friends Only</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="online-status">Show Online Status</Label>
                                    <p className="text-sm text-muted-foreground">Allow others to see when you're online</p>
                                </div>
                                <Switch
                                    id="online-status"
                                    checked={settings.privacy.showOnlineStatus}
                                    onCheckedChange={() => handlePrivacyChange("showOnlineStatus", null)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

