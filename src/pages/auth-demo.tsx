import AuthLayout from "@/components/AuthLayout"
import { useAuth } from "@/hooks/use-auth"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

export default function AuthDemo() {
  const { user, accessToken } = useAuth()

  return (
    <AuthLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Authentication Demo
          </h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                User Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Access Token (First 50 characters)
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm text-gray-600">
                  {accessToken ? `${accessToken.substring(0, 50)}...` : 'No access token'}
                </code>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Integration Tips
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Your entire app is now protected by the middleware</li>
                  <li>• Use the `useAuth()` hook to access user data and authentication state</li>
                  <li>• Wrap pages with `AuthLayout` for a consistent header with logout</li>
                  <li>• Use `ProtectedRoute` for additional page-level protection</li>
                  <li>• Access token is available for API calls to your backend</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

// This function runs on the server before the page is sent to the client
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
