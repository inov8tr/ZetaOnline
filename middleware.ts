import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/')
  ) {
    return res;
  }

  try {
    // Create supabase middleware client
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Authentication check
    if (!session && pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session) {
      // Get user role from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      const role = profile?.role || 'student';

      // Admin route protection
      if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/student', req.url));
      }

      // Teacher route protection
      if (pathname.startsWith('/dashboard/teacher') && role !== 'teacher' && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/student', req.url));
      }

      // Redirect authenticated users away from auth pages
      if (pathname.startsWith('/auth/')) {
        return NextResponse.redirect(
          new URL(
            role === 'admin'
              ? '/dashboard/admin'
              : role === 'teacher'
                ? '/dashboard/teacher'
                : '/dashboard/student',
            req.url,
          ),
        );
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, allow the request to continue
    // This prevents the middleware from blocking the request
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
