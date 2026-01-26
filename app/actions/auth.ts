'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// Validation schemas
const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
})

const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const UpdatePasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Server Action: Sign In
export async function signIn(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
    
    const validatedData = SignInSchema.parse(rawData)
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })
    
    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }
    
    revalidatePath('/', 'layout')
    redirect('/dashboard')
    
  } catch (error) {
    console.error('Error in signIn:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid form data',
        details: error.errors,
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Server Action: Sign Up
export async function signUp(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
    }
    
    const validatedData = SignUpSchema.parse(rawData)
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
        },
      },
    })
    
    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }
    
    return {
      success: true,
      message: 'Check your email to confirm your account',
    }
    
  } catch (error) {
    console.error('Error in signUp:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid form data',
        details: error.errors,
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Server Action: Sign Out
export async function signOut() {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }
    
    revalidatePath('/', 'layout')
    redirect('/auth/sign-in')
    
  } catch (error) {
    console.error('Error in signOut:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Server Action: Reset Password
export async function resetPassword(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
    }
    
    const validatedData = ResetPasswordSchema.parse(rawData)
    const supabase = await createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })
    
    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }
    
    return {
      success: true,
      message: 'Check your email for password reset instructions',
    }
    
  } catch (error) {
    console.error('Error in resetPassword:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid email address',
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Server Action: Update Password
export async function updatePassword(formData: FormData) {
  try {
    const rawData = {
      password: formData.get('password') as string,
    }
    
    const validatedData = UpdatePasswordSchema.parse(rawData)
    const supabase = await createClient()
    
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    })
    
    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }
    
    revalidatePath('/', 'layout')
    redirect('/dashboard')
    
  } catch (error) {
    console.error('Error in updatePassword:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}