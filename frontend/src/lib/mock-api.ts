import { createClient } from './supabase/client'

/**
 * Mock API for QR-based authentication system
 * (Now migrating to Supabase Auth)
 */

export interface User {
  key: string
  name: string
  phoneNumber: string
  createdAt: string
  id?: string // Supabase auth.users.id
}

const supabase = createClient()

/**
 * Register a new user using Supabase Anonymous Auth
 */
export const registerUser = async (
  key: string,
  name: string,
  phoneNumber: string
): Promise<{ user: User, isLinked: boolean }> => {
  const trimmedKey = key.trim()
  const trimmedName = name.trim()
  const trimmedPhone = phoneNumber.trim()
  
  if (!trimmedKey) throw new Error('Key is required')
  if (!trimmedName) throw new Error('Name is required')
  if (!trimmedPhone) throw new Error('Phone number is required')

  // 1. Sign in anonymously
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
  
  if (authError || !authData.user) {
    console.error('Supabase auth error:', authError)
    throw new Error('인증에 실패했습니다.')
  }

  // 2. Register or Link Session (RPC)
  const { data, error: rpcError } = await supabase.rpc('register_or_link_anonymous_session', {
    p_auth_id: authData.user.id,
    p_name: trimmedName,
    p_phone_number: trimmedPhone,
    p_qr_hash: trimmedKey
  })

  if (rpcError) {
    console.error('RPC Error:', rpcError)
    await supabase.auth.signOut()
    // Handle unique constraint on QR hash if there are other violations
    if (rpcError.message.includes('idx_medical_staff_qr_hash')) {
      throw new Error('이미 사용 중인 QR 코드입니다.')
    }
    throw new Error('프로필 등록에 실패했습니다.')
  }

  const isLinked = data?.status === 'linked'

  // Return formatted user
  const staffId = data?.staff_id
  return {
    user: {
      id: staffId,
      key: trimmedKey,
      name: trimmedName,
      phoneNumber: trimmedPhone,
      createdAt: new Date().toISOString(),
    },
    isLinked
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
    .select('id, qr_hash, name, phone_number, created_at')
    .eq('auth_id', session.user.id)
    .single()

  if (profileError) {
    console.error(`Profile fetch error for user ${session.user.id}:`, profileError)
    return null
  }

  if (!profile) return null

  return {
    id: profile.id,
    key: profile.qr_hash,
    name: profile.name,
    phoneNumber: profile.phone_number,
    createdAt: profile.created_at || new Date().toISOString(),
  }
}

