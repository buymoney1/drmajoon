import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'
  
  const authCookie = request.cookies.get('admin_auth')?.value

  if (isAdminRoute && !isLoginRoute && !authCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginRoute && authCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}