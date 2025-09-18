import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'

/**
 * Server-side logout page that handles Keycloak logout redirection
 * This page will redirect to Keycloak logout endpoint with proper parameters
 */
export default function LogoutPage() {
  // This component will never render as we redirect on the server side
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Signing out...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('🚪 Server-side logout initiated...')
  
  const session = await getServerSession(context.req, context.res, authOptions)
  
  if (session?.idToken) {
    // Build Keycloak logout URL
    const issuerUrl = process.env.OAUTH_ISSUER || "https://auth.mds-dev.think-it.io/realms/test-ui"
    const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`
    
    // Get the current protocol and host for the redirect URI
    const protocol = context.req.headers['x-forwarded-proto'] || 'http'
    const host = context.req.headers.host
    const postLogoutRedirectUri = `${protocol}://${host}/auth/signed-out`
    
    const params = new URLSearchParams({
      id_token_hint: session.idToken,
      post_logout_redirect_uri: postLogoutRedirectUri,
    })

    const keycloakLogoutUrl = `${logoutUrl}?${params}`
    
    console.log('🔄 Redirecting to Keycloak logout:', keycloakLogoutUrl)
    
    return {
      redirect: {
        destination: keycloakLogoutUrl,
        permanent: false,
      },
    }
  } else {
    console.log('⚠️ No ID token found, redirecting to signed-out page')
    
    return {
      redirect: {
        destination: '/auth/signed-out',
        permanent: false,
      },
    }
  }
}
