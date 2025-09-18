import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextRequest, NextResponse } from "next/server"

/**
 * Utility function to protect API routes with authentication
 * @param req - Next.js request object
 * @returns Session if authenticated, null if not
 */
export async function getAuthenticatedSession(req: NextRequest) {
  const session = await getServerSession(authOptions)
  return session
}

/**
 * Higher-order function to protect API route handlers
 * @param handler - The API route handler function
 * @returns Protected API route handler
 */
export function withAuth<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const session = await getAuthenticatedSession(req)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Add session to request context if needed
    ;(req as any).session = session
    
    return handler(req, ...args)
  }
}

/**
 * Middleware to check authentication for API routes
 * Use this in API route handlers that need authentication
 */
export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const session = await getAuthenticatedSession(req)
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Authentication required" },
      { status: 401 }
    )
  }
  
  return null // Continue with the request
}
