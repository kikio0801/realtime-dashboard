import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/mock-api'

export interface UserInfo {
  key: string
  name: string
  id?: string
}

const supabase = createClient()

/**
 * Custom hook to manage user authentication state
 * Uses Supabase Auth to persist user information
 */
export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSession = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser({
          key: currentUser.key,
          name: currentUser.name,
          id: currentUser.id,
        })
      } else {
        setUser(null)
      }
    } catch (e) {
      console.error('Session error', e)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Load initial session
  useEffect(() => {
    fetchSession()

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchSession()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/join'
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  }
}

