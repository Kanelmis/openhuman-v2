import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup'];
const API_PUBLIC_PATHS = ['/api/health', '/api/auth/login', '/api/auth/signup', '/api/mcp', '/api/webhooks'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // Allow static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // API routes: check for session cookie or API key
  if (pathname.startsWith('/api')) {
    // Allow public API paths
    if (API_PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

    const authHeader = req.headers.get('authorization');
    const sessionCookie = req.cookies.get('session');

    if (!authHeader && !sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Dashboard routes: check for session cookie
  const session = req.cookies.get('session');
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
