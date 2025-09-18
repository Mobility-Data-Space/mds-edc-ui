import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, ReactNode } from "react"

interface AppAuthWrapperProps {
  children: ReactNode
}

// List of routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/signin',
  '/auth/error',
  '/api/auth/signin',
  '/api/auth/callback',
  '/api/auth/signout',
]

/**
 * App-level authentication wrapper
 * This provides a fallback if middleware doesn't work properly
 */
export default function AppAuthWrapper({ children }: AppAuthWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Don't do anything while loading
    if (status === "loading") return

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      router.pathname.startsWith(route)
    )

    // If route is public, allow access
    if (isPublicRoute) {
      console.log("✅ Public route, allowing access:", router.pathname)
      return
    }

    // If no session and not on public route, redirect to sign-in
    if (!session) {
      console.log("🚫 No session found for protected route:", router.pathname)
      console.log("🔄 Redirecting to sign-in...")
      router.push('/auth/signin')
      return
    }

    console.log("✅ Session found for protected route:", router.pathname)
  }, [session, status, router])

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    router.pathname.startsWith(route)
  )

  // If no session and not on public route, show loading while redirecting
  if (!session && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  // Render children for authenticated users or public routes
  return <>{children}</>
}
