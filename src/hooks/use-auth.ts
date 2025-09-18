import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = () => signIn("keycloak")
  
  const logout = () => signOut({ callbackUrl: "/" })

  const isLoading = status === "loading"
  const isAuthenticated = !!session
  
  return {
    session,
    user: session?.user,
    accessToken: session?.accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
  }
}
