import { createClient } from './supabase/client'

/**
 * Mock API for QR-based authentication system
 * (Now migrating to Supabase Auth)
 */

export interface User {
  key: string
  name: string
  createdAt: string
  id?: string // Supabase auth.users.id
}

const supabase = createClient()

/**
 * Register a new user using Supabase Anonymous Auth
 */
export const registerUser = async (
  key: string,
  name: string
): Promise<User> => {
  const trimmedKey = key.trim()
  const trimmedName = name.trim()
  
  if (!trimmedKey) throw new Error('Key is required')
  if (!trimmedName) throw new Error('Name is required')

  // 1. Sign in anonymously
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
  
  if (authError || !authData.user) {
    console.error('Supabase auth error:', authError)
    throw new Error('인증에 실패했습니다.')
  }

  // 2. Save profile to Supabase
  const { error: profileError } = await supabase
    .from('medical_staff')
    .upsert({
      id: authData.user.id,
      qr_hash: trimmedKey,
      name: trimmedName,
      created_at: new Date().toISOString()
    })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    // If profile creation fails, we might still be logged in securely, 
    // but the app needs the profile. Good for debugging.
  }

  // Return formatted user
  return {
    id: authData.user.id,
    key: trimmedKey,
    name: trimmedName,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Get current authenticated user session
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) return null

  // Fetch profile to get name and qr_hash
  const { data: profile } = await supabase
    .from('medical_staff')
    .select('qr_hash, name, created_at')
    .eq('id', session.user.id)
    .single()

  if (!profile) return null

  return {
    id: session.user.id,
    key: profile.qr_hash,
    name: profile.name,
    createdAt: profile.created_at || new Date().toISOString(),
  }
}

