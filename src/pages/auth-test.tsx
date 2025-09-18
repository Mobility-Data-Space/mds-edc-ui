import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthTest() {
  const { data: session, status } = useSession()

  console.log('🔍 Auth Test - Status:', status, 'Session:', !!session)

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not signed in</h1>
          <button
            onClick={() => signIn("keycloak")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signed in as</h1>
        <p className="mb-4">{session?.user?.email || session?.user?.name}</p>
        <div className="space-x-4">
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button>
        </div>
        <div className="mt-8 text-left bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Session Data:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
