import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton pattern for client-side usage
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

// Helper functions for client-side operations
export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, any>) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signInWithProvider(provider: 'google' | 'github' | 'discord') {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signOut() {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function updatePassword(password: string) {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase.auth.updateUser({
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

// Real-time subscription helper
export function subscribeToUserGestures(userId: string, callback: (payload: any) => void) {
  const supabase = getSupabaseClient()
  
  return supabase
    .channel('user-gestures')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'custom_gestures',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

// Helper to get current session
export async function getCurrentSession() {
  const supabase = getSupabaseClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

// Helper to get current user
export async function getCurrentUser() {
  const supabase = getSupabaseClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}