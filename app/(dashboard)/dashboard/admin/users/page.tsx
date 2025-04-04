"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Download, Edit, Loader2, MoreHorizontal, Search, Trash, UserPlus, Users } from "lucide-react"
import Link from "next/link"

interface User {
    id: string
    user_id: string
    email: string
    display_name: string | null
    role: string
    created_at: string
    updated_at: string | null
    status?: string
}

export default function UsersPage() {
    const { user } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const usersPerPage = 10

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) return

            try {
                const { data: adminCheck, error: adminError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", user.id)
                    .single()

                if (adminError || adminCheck.role !== "admin") {
                    setError("You do not have permission to access this page")
                    setIsLoading(false)
                    return
                }

                const { data, error: fetchError } = await supabase
                    .from("profiles")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (fetchError) {
                    setError("Failed to load users")
                    return
                }

                const usersWithStatus: User[] = data.map((user: any): User => ({
                    ...user,
                    status: "active",
                }))

                setUsers(usersWithStatus)
                setFilteredUsers(usersWithStatus)
                setTotalPages(Math.ceil(usersWithStatus.length / usersPerPage))
            } catch {
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [user])

    useEffect(() => {
        let result = [...users]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) => user.display_name?.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
            )
        }

        if (roleFilter !== "all") {
            result = result.filter((user) => user.role === roleFilter)
        }

        if (statusFilter !== "all") {
            result = result.filter((user) => user.status === statusFilter)
        }

        setFilteredUsers(result)
        setTotalPages(Math.ceil(result.length / usersPerPage))
        setCurrentPage(1)
    }, [searchQuery, roleFilter, statusFilter, users])

    const getCurrentPageUsers = () => {
        const startIndex = (currentPage - 1) * usersPerPage
        const endIndex = startIndex + usersPerPage
        return filteredUsers.slice(startIndex, endIndex)
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            const { error } = await supabase.from("profiles").delete().eq("user_id", userId)
            if (error) {
                toast.error("Failed to delete user")
                return
            }
            setUsers(users.filter((u) => u.user_id !== userId))
            toast.success("User deleted successfully")
        } catch {
            toast.error("An unexpected error occurred")
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    if (error) {
        return (
            <div className="space-y-8">
                <h2 className="text-3xl font-bold">User Management</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/admin">Back to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* UI omitted for brevity */}
            <Table>
                <TableBody>
                    {getCurrentPageUsers().map((user: User) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.display_name || "N/A"}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.status}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant="ghost" onClick={() => handleDeleteUser(user.user_id)}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}