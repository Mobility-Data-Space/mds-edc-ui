import { signIn, getSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { error: urlError, callbackUrl } = router.query

  useEffect(() => {
    // Automatically redirect to Keycloak OAuth provider
    const handleAutoSignIn = async () => {
      try {
        console.log('🚀 Auto-redirecting to Keycloak OAuth...')
        
        // Directly redirect to the OAuth provider
        await signIn("keycloak", { 
          callbackUrl: (callbackUrl as string) || "/dashboard",
          redirect: true, // Allow NextAuth to handle the redirect
        })
      } catch (err) {
        console.error('❌ Auto sign-in error:', err)
        setError('Failed to redirect to login')
        setLoading(false)
      }
    }

    // Small delay to prevent issues with SSR
    const timer = setTimeout(handleAutoSignIn, 100)
    return () => clearTimeout(timer)
  }, [callbackUrl])

  const handleManualSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log('🚀 Manual sign-in triggered...')
      
      await signIn("keycloak", { 
        callbackUrl: (callbackUrl as string) || "/dashboard",
        redirect: true,
      })
    } catch (err) {
      console.error('❌ Manual sign-in error:', err)
      setError('Failed to redirect to login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Redirecting to login...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You will be automatically redirected to the login page
          </p>
          {(error || urlError) && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {urlError === "OAuthSignin" && "Error occurred during OAuth sign in"}
              {urlError === "OAuthCallback" && "Error occurred during OAuth callback"}
              {urlError === "OAuthCreateAccount" && "Error occurred creating OAuth account"}
              {urlError === "EmailCreateAccount" && "Error occurred creating email account"}
              {urlError === "Callback" && "Error occurred in callback"}
              {urlError === "OAuthAccountNotLinked" && "OAuth account not linked"}
              {urlError === "EmailSignin" && "Error occurred during email sign in"}
              {urlError === "CredentialsSignin" && "Invalid credentials"}
              {urlError === "SessionRequired" && "Please sign in to access this page"}
              {error && !urlError && error}
              {!["OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "EmailCreateAccount", "Callback", "OAuthAccountNotLinked", "EmailSignin", "CredentialsSignin", "SessionRequired"].includes(urlError as string) && !error && 
                "An error occurred during authentication"}
            </div>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleManualSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Redirecting to login...
              </div>
            ) : (
              "Click here if not redirected automatically"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
