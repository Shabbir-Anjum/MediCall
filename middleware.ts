import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

    // Allow API auth routes
    if (isApiAuthRoute) {
      return null;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    // Role-based access control
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isSettingsRoute = req.nextUrl.pathname.startsWith('/settings');

    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow access to settings for all authenticated users
    if (isSettingsRoute) {
      return null;
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow auth pages and API routes
        if (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname.startsWith('/api/auth')) {
          return true;
        }
        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

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
