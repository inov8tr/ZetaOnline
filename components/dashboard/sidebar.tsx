"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, BookOpen, GraduationCap, Home, LayoutDashboard, Settings, Users } from "lucide-react"

interface SidebarProps {
  userRole: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const studentLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/student",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      href: "/dashboard/student/courses",
      icon: BookOpen,
    },
    {
      name: "Assessments",
      href: "/dashboard/student/assessments",
      icon: GraduationCap,
    },
    {
      name: "Progress",
      href: "/dashboard/student/progress",
      icon: BarChart,
    },
    {
      name: "Settings",
      href: "/dashboard/student/settings",
      icon: Settings,
    },
  ]

  const teacherLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/teacher",
      icon: LayoutDashboard,
    },
    {
      name: "My Classes",
      href: "/dashboard/teacher/classes",
      icon: Users,
    },
    {
      name: "Course Materials",
      href: "/dashboard/teacher/materials",
      icon: BookOpen,
    },
    {
      name: "Student Progress",
      href: "/dashboard/teacher/progress",
      icon: BarChart,
    },
    {
      name: "Settings",
      href: "/dashboard/teacher/settings",
      icon: Settings,
    },
  ]

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Courses",
      href: "/dashboard/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: BarChart,
    },
    {
      name: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
  ]

  const links = userRole === "admin" ? adminLinks : userRole === "teacher" ? teacherLinks : studentLinks

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <span className="font-semibold">Zeta Online</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive("/") ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </li>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive(link.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

