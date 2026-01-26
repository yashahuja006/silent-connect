'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient, requireAuth } from '@/lib/supabase/server'
import type { InsertCustomGesture, CustomGesture } from '@/types/database'

// Validation schemas
const HandLandmarkSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  z: z.number(),
})

const CustomGestureSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  landmarks: z.array(HandLandmarkSchema).min(21).max(21), // MediaPipe hand has 21 landmarks
  confidence_threshold: z.number().min(0.1).max(1.0).default(0.7),
  category: z.string().max(50).optional(),
})

const UpdateGestureSchema = CustomGestureSchema.partial().extend({
  id: z.string().uuid(),
})

// Server Action: Save Custom Gesture
export async function saveCustomGesture(gestureData: unknown) {
  try {
    // 1. Check authentication
    const user = await requireAuth()
    
    // 2. Validate input data
    const validatedData = CustomGestureSchema.parse(gestureData)
    
    // 3. Create Supabase client
    const supabase = await createClient()
    
    // 4. Check if gesture name already exists for this user
    const { data: existingGesture } = await supabase
      .from('custom_gestures')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', validatedData.name)
      .single()
    
    if (existingGesture) {
      return {
        success: false,
        error: 'A gesture with this name already exists. Please choose a different name.',
      }
    }
    
    // 5. Prepare data for insertion
    const insertData: InsertCustomGesture = {
      user_id: user.id,
      name: validatedData.name,
      description: validatedData.description || null,
      landmarks: validatedData.landmarks,
      confidence_threshold: validatedData.confidence_threshold,
      category: validatedData.category || 'custom',
      is_active: true,
      usage_count: 0,
    }
    
    // 6. Insert into database
    const { data, error } = await supabase
      .from('custom_gestures')
      .insert(insertData as any)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to save gesture. Please try again.',
      }
    }
    
    // 7. Revalidate the gestures page
    revalidatePath('/dashboard/ai-trainer')
    
    return {
      success: true,
      data,
      message: 'Gesture saved successfully!',
    }
    
  } catch (error) {
    console.error('Error in saveCustomGesture:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid gesture data. Please check your input.',
        details: error.errors,
      }
    }
    
    if (error instanceof Error && error.message === 'Authentication required') {
      redirect('/auth/sign-in')
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

// Server Action: Get User's Custom Gestures
export async function getUserGestures() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('custom_gestures')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to fetch gestures.',
      }
    }
    
    return {
      success: true,
      data,
    }
    
  } catch (error) {
    console.error('Error in getUserGestures:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      redirect('/auth/sign-in')
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred.',
    }
  }
}

// Server Action: Update Custom Gesture
export async function updateCustomGesture(gestureData: unknown) {
  try {
    const user = await requireAuth()
    const validatedData = UpdateGestureSchema.parse(gestureData)
    const supabase = await createClient()
    
    // Check if gesture belongs to user
    const { data: existingGesture } = await supabase
      .from('custom_gestures')
      .select('user_id')
      .eq('id', validatedData.id)
      .single()
    
    if (!existingGesture || (existingGesture as any).user_id !== user.id) {
      return {
        success: false,
        error: 'Gesture not found or access denied.',
      }
    }
    
    // Update the gesture
    const { data, error } = await (supabase as any)
      .from('custom_gestures')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.id)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to update gesture.',
      }
    }
    
    revalidatePath('/dashboard/ai-trainer')
    
    return {
      success: true,
      data,
      message: 'Gesture updated successfully!',
    }
    
  } catch (error) {
    console.error('Error in updateCustomGesture:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid gesture data.',
        details: error.errors,
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred.',
    }
  }
}

// Server Action: Delete Custom Gesture
export async function deleteCustomGesture(gestureId: string) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    // Validate UUID
    const uuidSchema = z.string().uuid()
    const validatedId = uuidSchema.parse(gestureId)
    
    // Check if gesture belongs to user and delete
    const { error } = await supabase
      .from('custom_gestures')
      .delete()
      .eq('id', validatedId)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to delete gesture.',
      }
    }
    
    revalidatePath('/dashboard/ai-trainer')
    
    return {
      success: true,
      message: 'Gesture deleted successfully!',
    }
    
  } catch (error) {
    console.error('Error in deleteCustomGesture:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid gesture ID.',
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred.',
    }
  }
}

// Server Action: Toggle Gesture Active Status
export async function toggleGestureStatus(gestureId: string, isActive: boolean) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { data, error } = await (supabase as any)
      .from('custom_gestures')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', gestureId)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to update gesture status.',
      }
    }
    
    revalidatePath('/dashboard/ai-trainer')
    
    return {
      success: true,
      data,
      message: `Gesture ${isActive ? 'activated' : 'deactivated'} successfully!`,
    }
    
  } catch (error) {
    console.error('Error in toggleGestureStatus:', error)
    return {
      success: false,
      error: 'An unexpected error occurred.',
    }
  }
}

// Server Action: Increment Gesture Usage Count
export async function incrementGestureUsage(gestureId: string) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { error } = await (supabase as any)
      .from('custom_gestures')
      .update({ 
        usage_count: (supabase as any).sql`usage_count + 1`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', gestureId)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to update usage count.',
      }
    }
    
    return {
      success: true,
    }
    
  } catch (error) {
    console.error('Error in incrementGestureUsage:', error)
    return {
      success: false,
      error: 'An unexpected error occurred.',
    }
  }
}