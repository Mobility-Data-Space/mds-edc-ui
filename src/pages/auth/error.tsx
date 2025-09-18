import { useRouter } from "next/router"
import Link from "next/link"

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-sm">
              {error === "Configuration" && "There is a problem with the server configuration."}
              {error === "AccessDenied" && "Access denied. You do not have permission to sign in."}
              {error === "Verification" && "The verification token has expired or has already been used."}
              {!["Configuration", "AccessDenied", "Verification"].includes(error as string) && 
                "An unexpected error occurred during authentication."}
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <Link 
            href="/auth/signin"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}
