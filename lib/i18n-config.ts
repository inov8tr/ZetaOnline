export type Locale = "en" | "ko"

export const i18n = {
  defaultLocale: "en" as const,
  locales: ["en", "ko"] as const,
}

export function getLocalePartsFrom(path: string): {
  locale: Locale
  pathWithoutLocale: string
} {
  const pathParts = path.split("/").filter(Boolean)
  const locale = pathParts[0] as Locale
  const isLocale = i18n.locales.includes(locale)

  return {
    locale: isLocale ? locale : i18n.defaultLocale,
    pathWithoutLocale: isLocale ? `/${pathParts.slice(1).join("/")}` : path,
  }
}

