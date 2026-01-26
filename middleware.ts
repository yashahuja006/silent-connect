import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporarily disable authentication for demo purposes
  // Just return next response without Supabase auth checks
  return NextResponse.next()

  /* ORIGINAL AUTH CODE - COMMENTED OUT FOR DEMO
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value, options }: any) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/settings', '/profile']
  const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect logic
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isAuthRoute) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // Handle auth callback
  if (request.nextUrl.pathname === '/auth/callback') {
    const code = request.nextUrl.searchParams.get('code')
    
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }
    }
    
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return supabaseResponse
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/health|api/webhooks).*)',
  ],
}