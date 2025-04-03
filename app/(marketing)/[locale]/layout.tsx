import type { ReactNode } from "react"
import { LocaleNavbar } from "@/components/layout/locale-navbar"
import { LocaleFooter } from "@/components/layout/locale-footer"
import type { Locale } from "@/lib/i18n-config"

interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: Locale
  }
}

export default function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <LocaleNavbar locale={locale} />
      <main className="flex-1">{children}</main>
      <LocaleFooter locale={locale} />
    </div>
  )
}

