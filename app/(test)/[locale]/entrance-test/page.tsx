import EntranceTestIntro from "@/components/test/entrance-test-intro"
import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/lib/i18n-config"

export default async function EntranceTestPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  return (
    <div className="container mx-auto px-4 py-12">
      <EntranceTestIntro locale={locale} />
    </div>
  )
}

