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

  // 1.5. Check for existing qr_hash to prevent UNIQUE constraint violation
  const { data: existingUser } = await supabase
    .from('medical_staff')
    .select('id')
    .eq('qr_hash', trimmedKey)
    .single()

  if (existingUser) {
    // If we want to support re-login, we'd need a different strategy.
    // For now, prevent overwriting/erroring out silently.
    await supabase.auth.signOut()
    throw new Error('이미 등록된 QR 코드입니다.')
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
    // Sign out to prevent user from being logged in without a profile
    await supabase.auth.signOut()
    throw new Error('프로필 등록에 실패했습니다.')
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
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Supabase session error:', sessionError)
    return null
  }
  
  if (!session?.user) return null

  // Fetch profile to get name and qr_hash
  const { data: profile, error: profileError } = await supabase
    .from('medical_staff')
    .select('qr_hash, name, created_at')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    console.error(`Profile fetch error for user ${session.user.id}:`, profileError)
    return null
  }

  if (!profile) return null

  return {
    id: session.user.id,
    key: profile.qr_hash,
    name: profile.name,
    createdAt: profile.created_at || new Date().toISOString(),
  }
}

