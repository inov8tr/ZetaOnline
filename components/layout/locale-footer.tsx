import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"

interface LocaleFooterProps {
  locale: Locale
}

export function LocaleFooter({ locale }: LocaleFooterProps) {
  return (
    <footer className="bg-[#1e4b8e] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-white text-[#1e4b8e] flex items-center justify-center font-bold">
                Z
              </div>
              <span className="text-lg font-bold">Zeta Online</span>
            </div>
            <p className="text-blue-100 mb-4">Empowering students with innovative English education since 2010.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-blue-100 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-blue-100 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-blue-100 hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/program/beginner`} className="text-blue-100 hover:text-white">
                  Beginner Program
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/program/intermediate`} className="text-blue-100 hover:text-white">
                  Intermediate Program
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/program/advanced`} className="text-blue-100 hover:text-white">
                  Advanced Program
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/entrance-test`} className="text-blue-100 hover:text-white">
                  Entrance Test
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-blue-100 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-blue-100 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-blue-100 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/careers`} className="text-blue-100 hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/terms`} className="text-blue-100 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-blue-100 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-blue-100 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} Zeta Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

