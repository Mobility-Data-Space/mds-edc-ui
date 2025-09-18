import { signOut } from "next-auth/react"
import { useRouter } from "next/router"

/**
 * Custom logout function that properly signs out from both NextAuth and Keycloak
 * Uses server-side logout page to handle Keycloak redirection
 */
export function useKeycloakLogout() {
  const router = useRouter()

  const logout = async () => {
    console.log('� Starting complete logout process...')
    
    try {
      // First sign out from NextAuth (this clears the local session)
      await signOut({ redirect: false })
      
      // Then redirect to our server-side logout page
      // which will handle the Keycloak logout redirection
      console.log('🔄 Redirecting to server-side logout page...')
      router.push('/auth/logout')
    } catch (error) {
      console.error('❌ Error during logout:', error)
      // Fallback to simple logout
      await signOut({ callbackUrl: '/auth/signed-out' })
    }
  }

  return logout
}
