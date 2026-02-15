import { useState, useEffect } from 'react'

export interface UserInfo {
  key: string
  name: string
}

/**
 * Custom hook to manage user authentication state
 * Uses localStorage to persist user information
 */
export function useUser() {
  const [user, setUser] = useState<UserInfo | null>(() => {
    const key = localStorage.getItem('user_key')
    const name = localStorage.getItem('user_name')

    if (key && name) {
      return { key, name }
    }
    return null
  })

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const key = localStorage.getItem('user_key')
      const name = localStorage.getItem('user_name')

      if (key && name) {
        setUser({ key, name })
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const logout = () => {
    localStorage.removeItem('user_key')
    localStorage.removeItem('user_name')
    setUser(null)
    window.location.href = '/join'
  }

  return {
    user,
    isAuthenticated: !!user,
    logout,
  }
}
