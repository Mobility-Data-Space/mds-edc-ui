import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log(`🔒 Middleware executing for: ${req.nextUrl.pathname}`)
    
    // Allow the request to continue if authenticated
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthenticated = !!token
        const path = req.nextUrl.pathname
        
        console.log(`🔍 Checking auth for ${path} - Authenticated: ${isAuthenticated}`)
        
        if (!isAuthenticated) {
          console.log(`🚫 Blocking unauthorized access to: ${path}`)
        }
        
        return isAuthenticated
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files) 
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * Also match root and all page routes explicitly
     */
    '/',
    '/dashboard/:path*',
    '/assets/:path*',
    '/catalog-browser/:path*',
    '/contract-agreements/:path*',
    '/contract-negotiations/:path*',
    '/create-data-offer/:path*',
    '/data-offers/:path*',
    '/policy-definitions/:path*',
    '/transfer-processes/:path*',
    '/negotiation-manual-approval/:path*',
    '/auth-demo',
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.ico$|.*\\.webp$).*)",
  ],
}
