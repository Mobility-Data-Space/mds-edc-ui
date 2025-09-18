# NextAuth Integration Guide

This application now uses NextAuth.js to protect the entire application with OAuth authentication via Keycloak.

## 🔐 Authentication Setup

### Environment Variables
The following environment variables are configured in `.envrc`:

```bash
NEXTAUTH_SECRET="TEST_NEXTAUTH_SECRET"  # Secret for JWT token encryption
NEXTAUTH_URL="http://localhost:3000"    # Your app's URL
OAUTH_CLIENT_ID="test-ui"               # Your Keycloak client ID
OAUTH_CLIENT_SECRET="xqkQswpBJqfSnxXsXWBtYrkYlxaoeeiq"  # Your Keycloak client secret
OAUTH_ISSUER="https://auth.mds-dev.think-it.io/realms/test-ui"  # Your Keycloak realm URL
```

### Key Features

1. **🛡️ Full Application Protection**: The middleware protects all routes except authentication endpoints and static files
2. **🎫 OAuth Integration**: Seamlessly integrates with your existing Keycloak setup
3. **🔄 Automatic Redirects**: Users are automatically redirected to sign-in when needed
4. **📱 Responsive UI**: Clean, responsive authentication pages
5. **🎣 React Hooks**: Easy-to-use hooks for authentication state management

## 📁 File Structure

```
src/
├── pages/
│   ├── api/auth/[...nextauth].ts  # NextAuth API configuration
│   ├── auth/
│   │   ├── signin.tsx             # Custom sign-in page
│   │   └── error.tsx              # Authentication error page
│   └── auth-demo.tsx              # Demo page showing auth integration
├── components/
│   ├── AuthLayout.tsx             # Layout with user info and logout
│   └── ProtectedRoute.tsx         # Component for additional route protection
├── hooks/
│   └── use-auth.ts                # Authentication hook
├── types/
│   └── next-auth.d.ts             # TypeScript type extensions
└── middleware.ts                  # Route protection middleware
```

## 🚀 Usage Examples

### Using the Authentication Hook

```tsx
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout, accessToken } = useAuth()

  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Sign Out</button>
      {/* Use accessToken for API calls */}
    </div>
  )
}
```

### Using the AuthLayout Component

```tsx
import AuthLayout from '@/components/AuthLayout'

export default function MyPage() {
  return (
    <AuthLayout>
      <h1>My Protected Content</h1>
      <p>This content is only visible to authenticated users.</p>
    </AuthLayout>
  )
}
```

### Using ProtectedRoute Component

```tsx
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SensitivePage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  )
}
```

### Server-Side Protection

```tsx
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

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
    props: { session },
  }
}
```

## 🔧 API Integration

The access token is available in your session and can be used for API calls:

```tsx
import { useAuth } from '@/hooks/use-auth'

function ApiExample() {
  const { accessToken } = useAuth()

  const callApi = async () => {
    const response = await fetch('/api/some-endpoint', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    return response.json()
  }

  return <button onClick={callApi}>Call Protected API</button>
}
```

## 🎯 Testing

Visit `/auth-demo` to see a demonstration of the authentication system in action.

## 🔄 Flow Overview

1. User visits any protected route
2. Middleware checks for valid session
3. If no session, redirect to `/auth/signin`
4. Sign-in page automatically redirects to Keycloak OAuth
5. After successful authentication, user is redirected back to the original route
6. Session is maintained across page refreshes and browser tabs

## 🛠️ Customization

- **Styling**: Update the authentication pages in `src/pages/auth/` to match your design
- **Additional Claims**: Modify the profile callback in `[...nextauth].ts` to include more user data
- **Route Protection**: Adjust the middleware matcher pattern to exclude specific routes
- **Error Handling**: Customize error messages in the error page

## 🚦 Getting Started

1. Make sure your environment variables are set in `.envrc`
2. Start your development server: `yarn dev`
3. Visit any page - you'll be redirected to sign in
4. After authentication, you'll have access to the entire application

The authentication system is now fully integrated and protecting your entire Next.js application!
