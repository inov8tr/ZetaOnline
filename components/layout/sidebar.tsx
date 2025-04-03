'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Book,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Settings,
  TestTube,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const studentNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard/student',
      icon: Home,
    },
    {
      title: 'My Tests',
      href: '/dashboard/student/tests',
      icon: TestTube,
    },
    {
      title: 'Courses',
      href: '/dashboard/student/courses',
      icon: Book,
    },
    {
      title: 'Assignments',
      href: '/dashboard/student/assignments',
      icon: FileText,
    },
    {
      title: 'Reports',
      href: '/dashboard/student/reports',
      icon: BarChart,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: Home,
    },
    {
      title: 'Users',
      href: '/dashboard/admin/users',
      icon: Users,
    },
    {
      title: 'Tests',
      href: '/dashboard/admin/tests',
      icon: TestTube,
    },
    {
      title: 'Courses',
      href: '/dashboard/admin/courses',
      icon: Book,
    },
    {
      title: 'Reports',
      href: '/dashboard/admin/reports',
      icon: BarChart,
    },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  const bottomNavItems: NavItem[] = [
    {
      title: 'Settings',
      href: `/dashboard/${user?.role}/settings`,
      icon: Settings,
    },
    {
      title: 'Profile',
      href: `/dashboard/${user?.role}/profile`,
      icon: User,
    },
  ];

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            Z
          </div>
          {!collapsed && <span className="text-lg font-bold">Zeta Online</span>}
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={collapsed ? 0 : 999999}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        <div className="space-y-4 px-2">
          <Separator />
          <nav className="space-y-1">
            <TooltipProvider delayDuration={0}>
              {bottomNavItems.map((item) => (
                <Tooltip key={item.href} delayDuration={collapsed ? 0 : 999999}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted',
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                </Tooltip>
              ))}

              <Tooltip delayDuration={collapsed ? 0 : 999999}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span className="ml-3">Sign out</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Sign out</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        <span className="sr-only">{collapsed ? 'Expand' : 'Collapse'} sidebar</span>
      </Button>
    </aside>
  );
}
