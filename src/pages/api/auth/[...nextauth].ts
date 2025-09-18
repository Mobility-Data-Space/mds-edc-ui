import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

// Debug environment variables
console.log('🔍 NextAuth Environment Variables:')
console.log('OAUTH_CLIENT_ID:', process.env.OAUTH_CLIENT_ID ? '✅ Set' : '❌ Missing')
console.log('OAUTH_CLIENT_SECRET:', process.env.OAUTH_CLIENT_SECRET ? '✅ Set' : '❌ Missing')
console.log('OAUTH_ISSUER:', process.env.OAUTH_ISSUER ? '✅ Set' : '❌ Missing')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set')

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "keycloak",
      name: "Keycloak",
      type: "oauth",
      wellKnown: `${process.env.OAUTH_ISSUER || "https://auth.mds-dev.think-it.io/realms/test-ui"}/.well-known/openid-configuration`,
      authorization: { 
        params: { 
          scope: "openid email profile",
          response_type: "code",
        } 
      },
      idToken: true,
      checks: ["pkce", "state"],
      clientId: process.env.OAUTH_CLIENT_ID || "test-ui",
      clientSecret: process.env.OAUTH_CLIENT_SECRET || "xqkQswpBJqfSnxXsXWBtYrkYlxaoeeiq",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        }
      },
    }
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log('🔧 JWT Callback - Account:', !!account, 'Profile:', !!profile)
      
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        console.log('💾 Storing access token in JWT')
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      console.log('🔧 Session Callback - Token:', !!token.accessToken)
      
      // Send properties to the client, like an access_token from a provider.
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token.idToken) {
        session.idToken = token.idToken
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect Callback - URL:', url, 'BaseURL:', baseUrl)
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signOut({ token }) {
      console.log('🚪 Sign out event triggered')
      
      if (token?.idToken) {
        const issuerUrl = process.env.OAUTH_ISSUER || "https://auth.mds-dev.think-it.io/realms/test-ui"
        const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`
        const params = new URLSearchParams({
          id_token_hint: token.idToken as string,
          post_logout_redirect_uri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signed-out`,
        })
        
        console.log('🔄 Keycloak logout URL:', `${logoutUrl}?${params}`)
        
        try {
          // Call Keycloak logout endpoint
          await fetch(`${logoutUrl}?${params}`, {
            method: 'GET',
          })
          console.log('✅ Keycloak session invalidated')
        } catch (error) {
          console.error('❌ Error during Keycloak logout:', error)
        }
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || "TEST_NEXTAUTH_SECRET",
}

const handler = NextAuth(authOptions)

export default handler
