"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Bell, HardDrive, Loader2, Mail, Shield, Trash } from "lucide-react"

export default function SettingsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("general")
    const [isSaving, setIsSaving] = useState(false)

    // General settings
    const [generalSettings, setGeneralSettings] = useState({
        siteName: "Zeta Online",
        siteDescription: "Online learning platform for students",
        contactEmail: "admin@zetaonline.com",
        supportEmail: "support@zetaonline.com",
        defaultLanguage: "en",
    })

    // Email settings
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: "",
        smtpPort: "",
        smtpUser: "",
        smtpPassword: "",
        senderName: "Zeta Online",
        senderEmail: "noreply@zetaonline.com",
        enableEmailNotifications: true,
    })

    // Security settings
    const [securitySettings, setSecuritySettings] = useState({
        minimumPasswordLength: "8",
        requirePasswordComplexity: true,
        sessionTimeout: "30",
        enableTwoFactor: false,
        allowUserRegistration: true,
    })

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        enableEmailNotifications: true,
        enablePushNotifications: false,
        adminNewUserNotification: true,
        adminNewEnrollmentNotification: true,
        userWelcomeEmail: true,
        userCourseCompletionEmail: true,
    })

    // Storage settings
    const [storageSettings, setStorageSettings] = useState({
        maxUploadSize: "10",
        allowedFileTypes: "pdf,doc,docx,jpg,png,mp3,mp4",
        storageProvider: "local",
        s3Bucket: "",
        s3Region: "",
        s3AccessKey: "",
        s3SecretKey: "",
    })

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setGeneralSettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEmailSettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSecuritySettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleStorageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setStorageSettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (setting: string, category: string, checked: boolean) => {
        switch (category) {
            case "email":
                setEmailSettings((prev) => ({ ...prev, [setting]: checked }))
                break
            case "security":
                setSecuritySettings((prev) => ({ ...prev, [setting]: checked }))
                break
            case "notification":
                setNotificationSettings((prev) => ({ ...prev, [setting]: checked }))
                break
            default:
                break
        }
    }

    const handleSelectChange = (value: string, setting: string, category: string) => {
        switch (category) {
            case "general":
                setGeneralSettings((prev) => ({ ...prev, [setting]: value }))
                break
            case "storage":
                setStorageSettings((prev) => ({ ...prev, [setting]: value }))
                break
            default:
                break
        }
    }

    const handleSaveSettings = () => {
        setIsSaving(true)

        // In a real application, this would save to the database
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Settings saved successfully")
        }, 1000)
    }

    const handleClearCache = () => {
        // In a real application, this would clear the application cache
        toast.success("Cache cleared successfully")
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                <p className="text-muted-foreground">Configure platform settings and preferences</p>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="flex items-center gap-2">
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
                            className="h-4 w-4"
                        >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>General</span>
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="storage" className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        <span>Storage</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Basic platform configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input id="siteName" name="siteName" value={generalSettings.siteName} onChange={handleGeneralChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <Textarea
                                    id="siteDescription"
                                    name="siteDescription"
                                    value={generalSettings.siteDescription}
                                    onChange={handleGeneralChange}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Contact Email</Label>
                                    <Input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        value={generalSettings.contactEmail}
                                        onChange={handleGeneralChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input
                                        id="supportEmail"
                                        name="supportEmail"
                                        type="email"
                                        value={generalSettings.supportEmail}
                                        onChange={handleGeneralChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="defaultLanguage">Default Language</Label>
                                <Select
                                    value={generalSettings.defaultLanguage}
                                    onValueChange={(value) => handleSelectChange(value, "defaultLanguage", "general")}
                                >
                                    <SelectTrigger id="defaultLanguage">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="ko">Korean</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance</CardTitle>
                            <CardDescription>System maintenance operations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-medium">Clear Cache</h3>
                                    <p className="text-sm text-muted-foreground">Clear the application cache to refresh data</p>
                                </div>
                                <Button variant="outline" onClick={handleClearCache}>
                                    Clear Cache
                                </Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-medium">System Backup</h3>
                                    <p className="text-sm text-muted-foreground">Create a backup of the system data</p>
                                </div>
                                <Button variant="outline">Create Backup</Button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
                                    <p className="text-sm text-muted-foreground">Reset the system to default settings</p>
                                </div>
                                <Button variant="destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Reset System
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Configuration</CardTitle>
                            <CardDescription>Configure email server settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">SMTP Host</Label>
                                    <Input
                                        id="smtpHost"
                                        name="smtpHost"
                                        value={emailSettings.smtpHost}
                                        onChange={handleEmailChange}
                                        placeholder="smtp.example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input
                                        id="smtpPort"
                                        name="smtpPort"
                                        value={emailSettings.smtpPort}
                                        onChange={handleEmailChange}
                                        placeholder="587"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUser">SMTP Username</Label>
                                    <Input id="smtpUser" name="smtpUser" value={emailSettings.smtpUser} onChange={handleEmailChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                                    <Input
                                        id="smtpPassword"
                                        name="smtpPassword"
                                        type="password"
                                        value={emailSettings.smtpPassword}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="senderName">Sender Name</Label>
                                    <Input
                                        id="senderName"
                                        name="senderName"
                                        value={emailSettings.senderName}
                                        onChange={handleEmailChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="senderEmail">Sender Email</Label>
                                    <Input
                                        id="senderEmail"
                                        name="senderEmail"
                                        type="email"
                                        value={emailSettings.senderEmail}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enableEmailNotifications"
                                    checked={emailSettings.enableEmailNotifications}
                                    onCheckedChange={(checked) => handleSwitchChange("enableEmailNotifications", "email", checked)}
                                />
                                <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                            <CardDescription>Manage system email templates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-medium">Welcome Email</h3>
                                        <p className="text-sm text-muted-foreground">Sent to new users upon registration</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Edit Template
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-medium">Password Reset</h3>
                                        <p className="text-sm text-muted-foreground">Sent when a user requests a password reset</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Edit Template
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-medium">Course Enrollment</h3>
                                        <p className="text-sm text-muted-foreground">Sent to users upon enrollment in a course.</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Edit Template
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Configure security settings for the platform</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minimumPasswordLength">Minimum Password Length</Label>
                                    <Input
                                        id="minimumPasswordLength"
                                        name="minimumPasswordLength"
                                        type="number"
                                        value={securitySettings.minimumPasswordLength}
                                        onChange={handleSecurityChange}
                                        placeholder="8"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                    <Input
                                        id="sessionTimeout"
                                        name="sessionTimeout"
                                        type="number"
                                        value={securitySettings.sessionTimeout}
                                        onChange={handleSecurityChange}
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="requirePasswordComplexity"
                                    checked={securitySettings.requirePasswordComplexity}
                                    onCheckedChange={(checked) => handleSwitchChange("requirePasswordComplexity", "security", checked)}
                                />
                                <Label htmlFor="requirePasswordComplexity">Require Password Complexity</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enableTwoFactor"
                                    checked={securitySettings.enableTwoFactor}
                                    onCheckedChange={(checked) => handleSwitchChange("enableTwoFactor", "security", checked)}
                                />
                                <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="allowUserRegistration"
                                    checked={securitySettings.allowUserRegistration}
                                    onCheckedChange={(checked) => handleSwitchChange("allowUserRegistration", "security", checked)}
                                />
                                <Label htmlFor="allowUserRegistration">Allow User Registration</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Configure notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enableEmailNotifications"
                                    checked={notificationSettings.enableEmailNotifications}
                                    onCheckedChange={(checked) => handleSwitchChange("enableEmailNotifications", "notification", checked)}
                                />
                                <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enablePushNotifications"
                                    checked={notificationSettings.enablePushNotifications}
                                    onCheckedChange={(checked) => handleSwitchChange("enablePushNotifications", "notification", checked)}
                                />
                                <Label htmlFor="enablePushNotifications">Enable Push Notifications</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="adminNewUserNotification"
                                    checked={notificationSettings.adminNewUserNotification}
                                    onCheckedChange={(checked) => handleSwitchChange("adminNewUserNotification", "notification", checked)}
                                />
                                <Label htmlFor="adminNewUserNotification">Admin - New User Notification</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="adminNewEnrollmentNotification"
                                    checked={notificationSettings.adminNewEnrollmentNotification}
                                    onCheckedChange={(checked) =>
                                        handleSwitchChange("adminNewEnrollmentNotification", "notification", checked)
                                    }
                                />
                                <Label htmlFor="adminNewEnrollmentNotification">Admin - New Enrollment Notification</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="userWelcomeEmail"
                                    checked={notificationSettings.userWelcomeEmail}
                                    onCheckedChange={(checked) => handleSwitchChange("userWelcomeEmail", "notification", checked)}
                                />
                                <Label htmlFor="userWelcomeEmail">User - Welcome Email</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="userCourseCompletionEmail"
                                    checked={notificationSettings.userCourseCompletionEmail}
                                    onCheckedChange={(checked) =>
                                        handleSwitchChange("userCourseCompletionEmail", "notification", checked)
                                    }
                                />
                                <Label htmlFor="userCourseCompletionEmail">User - Course Completion Email</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="storage" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Storage Settings</CardTitle>
                            <CardDescription>Configure storage settings for file uploads</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                                <Input
                                    id="maxUploadSize"
                                    name="maxUploadSize"
                                    type="number"
                                    value={storageSettings.maxUploadSize}
                                    onChange={handleStorageChange}
                                    placeholder="10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                                <Input
                                    id="allowedFileTypes"
                                    name="allowedFileTypes"
                                    value={storageSettings.allowedFileTypes}
                                    onChange={handleStorageChange}
                                    placeholder="pdf,doc,docx,jpg,png"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="storageProvider">Storage Provider</Label>
                                <Select
                                    value={storageSettings.storageProvider}
                                    onValueChange={(value) => handleSelectChange(value, "storageProvider", "storage")}
                                >
                                    <SelectTrigger id="storageProvider">
                                        <SelectValue placeholder="Select storage provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="local">Local</SelectItem>
                                        <SelectItem value="s3">Amazon S3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {storageSettings.storageProvider === "s3" && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="s3Bucket">S3 Bucket Name</Label>
                                        <Input
                                            id="s3Bucket"
                                            name="s3Bucket"
                                            value={storageSettings.s3Bucket}
                                            onChange={handleStorageChange}
                                            placeholder="your-s3-bucket-name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="s3Region">S3 Region</Label>
                                        <Input
                                            id="s3Region"
                                            name="s3Region"
                                            value={storageSettings.s3Region}
                                            onChange={handleStorageChange}
                                            placeholder="us-east-1"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="s3AccessKey">S3 Access Key</Label>
                                        <Input
                                            id="s3AccessKey"
                                            name="s3AccessKey"
                                            value={storageSettings.s3AccessKey}
                                            onChange={handleStorageChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="s3SecretKey">S3 Secret Key</Label>
                                        <Input
                                            id="s3SecretKey"
                                            name="s3SecretKey"
                                            type="password"
                                            value={storageSettings.s3SecretKey}
                                            onChange={handleStorageChange}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

