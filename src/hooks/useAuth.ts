import { useAuth0 } from '@auth0/auth0-react'

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    loginWithRedirect, 
    logout 
  } = useAuth0()

  return {
    user: isAuthenticated ? user : null,
    loading: isLoading,
    signInWithGoogle: () => loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    }),
    signOut: () => logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    })
  }
}