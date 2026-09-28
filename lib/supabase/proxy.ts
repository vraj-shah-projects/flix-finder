import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and supabase.auth.getClaims().
  // A basic mistake could make it very hard to debug users being randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

    // Page routes that require a logged-in user - redirect to /login.
  const protectedPagePaths = ['/dashboard', '/watchlist', '/stats', '/recommendations']
  const isProtectedPage = protectedPagePaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // API routes that require a logged-in user - return 401 JSON, not a redirect.
  // TMDB search is intentionally excluded here since browsing is public.
  const protectedApiPaths = ['/api/watchlist']
  const isProtectedApi = protectedApiPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (!user && isProtectedApi) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // You *must* return supabaseResponse as-is (or copy its cookies onto
  // whatever you return) or the browser and server sessions go out of sync.
  return supabaseResponse
}