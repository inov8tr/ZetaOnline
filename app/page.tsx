import { redirect } from "next/navigation"
import { i18n } from "@/lib/i18n-config"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Redirect from the root to the default locale
export default function RootPage() {
  redirect(`/${i18n.defaultLocale}`)
}

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-lg font-bold">Zeta Online</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/program" className="text-sm font-medium">
              Programs
            </Link>
            <Link href="/blog" className="text-sm font-medium">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-muted py-24 md:py-32">
          <div className="container grid items-center gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Master Your Skills with Zeta Online
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Advanced learning platform with personalized courses, assessments, and tracking for students of all
                levels.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/program">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden aspect-video rounded-xl bg-muted/50 md:block"></div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container grid gap-12 px-4 md:grid-cols-3 md:px-6">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                  <path d="M6 12h12" />
                  <path d="M12 6v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Adaptive Learning</h3>
              <p className="text-muted-foreground">Courses dynamically adjust to your skill level and learning pace.</p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Comprehensive Assessment</h3>
              <p className="text-muted-foreground">Detailed entrance and periodic tests to measure your progress.</p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Personalized Tracking</h3>
              <p className="text-muted-foreground">Track your learning journey with detailed progress analytics.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Zeta Online. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

