"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import LanguageSwitcher from "./language-switcher"
import type { Locale } from "@/lib/i18n-config"

interface LocaleNavbarProps {
  locale: Locale
}

export function LocaleNavbar({ locale }: LocaleNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}${path}/`)
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1e4b8e]" />
            <span className="text-lg font-bold">Zeta Online</span>
          </Link>
        </div>

        <nav className="hidden gap-6 md:flex">
          <Link
            href={`/${locale}`}
            className={`text-sm font-medium ${isActive("") ? "text-[#1e4b8e] font-semibold" : ""}`}
          >
            Home
          </Link>
          <Link
            href={`/${locale}/about`}
            className={`text-sm font-medium ${isActive("/about") ? "text-[#1e4b8e] font-semibold" : ""}`}
          >
            About
          </Link>
          <Link
            href={`/${locale}/program`}
            className={`text-sm font-medium ${isActive("/program") ? "text-[#1e4b8e] font-semibold" : ""}`}
          >
            Programs
          </Link>
          <Link
            href={`/${locale}/blog`}
            className={`text-sm font-medium ${isActive("/blog") ? "text-[#1e4b8e] font-semibold" : ""}`}
          >
            Blog
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={`text-sm font-medium ${isActive("/contact") ? "text-[#1e4b8e] font-semibold" : ""}`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-4">
            <Link href={`/${locale}/login`}>
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button className="bg-[#1e4b8e] hover:bg-[#163a71]">Get Started</Button>
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href={`/${locale}`} onClick={() => setIsOpen(false)} className="text-sm font-medium">
                  Home
                </Link>
                <Link href={`/${locale}/about`} onClick={() => setIsOpen(false)} className="text-sm font-medium">
                  About
                </Link>
                <Link href={`/${locale}/program`} onClick={() => setIsOpen(false)} className="text-sm font-medium">
                  Programs
                </Link>
                <Link href={`/${locale}/blog`} onClick={() => setIsOpen(false)} className="text-sm font-medium">
                  Blog
                </Link>
                <Link href={`/${locale}/contact`} onClick={() => setIsOpen(false)} className="text-sm font-medium">
                  Contact
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Link href={`/${locale}/login`} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href={`/${locale}/register`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-[#1e4b8e] hover:bg-[#163a71]">Get Started</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

