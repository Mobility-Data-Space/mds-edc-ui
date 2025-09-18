import { useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

export default function SignedOut() {
  const router = useRouter()

  useEffect(() => {
    // Clear any remaining session data
    console.log('🧹 Clearing any remaining session data...')
    
    // Auto-redirect to sign-in after 3 seconds
    const timer = setTimeout(() => {
      router.push('/auth/signin')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Signed Out Successfully
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You have been successfully signed out from both the application and Keycloak.
          </p>
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  Your session has been completely terminated.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">
              You will be redirected to the sign-in page in a few seconds...
            </p>
            <Link 
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
