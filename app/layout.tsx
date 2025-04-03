import type React from 'react';
import type { Metadata } from 'next';
import { Mona_Sans as FontSans, Content as FontHeading } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = FontHeading({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    default: 'Zeta Online',
    template: '%s | Zeta Online',
  },
  description: 'Advanced learning platform with personalized courses and assessments',
  keywords: ['education', 'learning', 'online courses', 'assessment', 'tests'],
  authors: [
    {
      name: 'Zeta Online Team',
    },
  ],
  creator: 'Zeta Online',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zeta-online.vercel.app',
    title: 'Zeta Online',
    description: 'Advanced learning platform with personalized courses and assessments',
    siteName: 'Zeta Online',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeta Online',
    description: 'Advanced learning platform with personalized courses and assessments',
    creator: '@zetaonline',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
