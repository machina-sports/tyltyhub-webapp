import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MAINTENANCE_CONFIG } from './config/maintenance'

export function middleware(request: NextRequest) {
  // If offline mode is disabled, continue normally
  if (!MAINTENANCE_CONFIG.isEnabled) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Check if the current route is in the allowed routes list
  const isAllowedPath = MAINTENANCE_CONFIG.allowedPaths.some((path: string) => 
    pathname.startsWith(path)
  )

  // If not in allowed routes, redirect to site-offline
  if (!isAllowedPath) {
    const url = request.nextUrl.clone()
    url.pathname = MAINTENANCE_CONFIG.redirectTo
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes, except static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 