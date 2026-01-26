export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'premium' | 'enterprise'
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'premium' | 'enterprise'
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'premium' | 'enterprise'
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_gestures: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          landmarks: Json
          confidence_threshold: number
          category: string | null
          is_active: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          landmarks: Json
          confidence_threshold?: number
          category?: string | null
          is_active?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          landmarks?: Json
          confidence_threshold?: number
          category?: string | null
          is_active?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_gestures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      gesture_sessions: {
        Row: {
          id: string
          user_id: string
          session_type: 'practice' | 'training' | 'translation'
          gestures_performed: Json
          accuracy_score: number | null
          duration_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_type: 'practice' | 'training' | 'translation'
          gestures_performed: Json
          accuracy_score?: number | null
          duration_seconds: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_type?: 'practice' | 'training' | 'translation'
          gestures_performed?: Json
          accuracy_score?: number | null
          duration_seconds?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gesture_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      health_analytics: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          stability_score: number
          range_of_motion: number
          hand_strength: number | null
          tremor_analysis: Json | null
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          stability_score: number
          range_of_motion: number
          hand_strength?: number | null
          tremor_analysis?: Json | null
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          stability_score?: number
          range_of_motion?: number
          hand_strength?: number | null
          tremor_analysis?: Json | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "gesture_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'premium' | 'enterprise'
      session_type: 'practice' | 'training' | 'translation'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CustomGesture = Database['public']['Tables']['custom_gestures']['Row']
export type GestureSession = Database['public']['Tables']['gesture_sessions']['Row']
export type HealthAnalytics = Database['public']['Tables']['health_analytics']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertCustomGesture = Database['public']['Tables']['custom_gestures']['Insert']
export type InsertGestureSession = Database['public']['Tables']['gesture_sessions']['Insert']
export type InsertHealthAnalytics = Database['public']['Tables']['health_analytics']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateCustomGesture = Database['public']['Tables']['custom_gestures']['Update']
export type UpdateGestureSession = Database['public']['Tables']['gesture_sessions']['Update']
export type UpdateHealthAnalytics = Database['public']['Tables']['health_analytics']['Update']