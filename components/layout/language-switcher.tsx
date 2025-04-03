"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { i18n, type Locale } from "@/lib/i18n-config"

export default function LanguageSwitcher() {
  const pathName = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const currentLocale = pathName.split("/")[1] as Locale

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/"

    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
          <Globe className="h-4 w-4" />
          <span className="uppercase">{currentLocale}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className={`flex items-center gap-2 ${locale === currentLocale ? "bg-muted" : ""}`}
            onClick={() => {
              router.push(redirectedPathName(locale))
              setOpen(false)
            }}
          >
            {locale === currentLocale && <Check className="h-4 w-4" />}
            <span className={locale === currentLocale ? "font-medium" : ""}>
              {locale === "en" ? "English" : "한국어"}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

