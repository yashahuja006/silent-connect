-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'enterprise');
CREATE TYPE session_type AS ENUM ('practice', 'training', 'translation');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create custom_gestures table
CREATE TABLE IF NOT EXISTS public.custom_gestures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    landmarks JSONB NOT NULL, -- Array of 21 hand landmarks with x, y, z coordinates
    confidence_threshold REAL DEFAULT 0.7 CHECK (confidence_threshold >= 0.1 AND confidence_threshold <= 1.0),
    category TEXT DEFAULT 'custom',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure unique gesture names per user
    UNIQUE(user_id, name)
);

-- Create gesture_sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS public.gesture_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_type session_type NOT NULL,
    gestures_performed JSONB NOT NULL DEFAULT '[]', -- Array of gestures with timestamps and accuracy
    accuracy_score REAL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create health_analytics table for rehabilitation data
CREATE TABLE IF NOT EXISTS public.health_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.gesture_sessions(id) ON DELETE SET NULL,
    stability_score REAL NOT NULL CHECK (stability_score >= 0 AND stability_score <= 100),
    range_of_motion REAL NOT NULL CHECK (range_of_motion >= 0),
    hand_strength REAL CHECK (hand_strength >= 0 AND hand_strength <= 100),
    tremor_analysis JSONB, -- Detailed tremor analysis data
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_gestures_user_id ON public.custom_gestures(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_gestures_active ON public.custom_gestures(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_gesture_sessions_user_id ON public.gesture_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_gesture_sessions_created_at ON public.gesture_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_analytics_user_id ON public.health_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_analytics_recorded_at ON public.health_analytics(recorded_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_gestures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gesture_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for custom_gestures table
CREATE POLICY "Users can view own gestures" ON public.custom_gestures
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gestures" ON public.custom_gestures
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gestures" ON public.custom_gestures
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gestures" ON public.custom_gestures
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gesture_sessions table
CREATE POLICY "Users can view own sessions" ON public.gesture_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.gesture_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.gesture_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for health_analytics table
CREATE POLICY "Users can view own health data" ON public.health_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health data" ON public.health_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health data" ON public.health_analytics
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_custom_gestures
    BEFORE UPDATE ON public.custom_gestures
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to get user gesture statistics
CREATE OR REPLACE FUNCTION public.get_user_gesture_stats(user_uuid UUID)
RETURNS TABLE (
    total_gestures INTEGER,
    active_gestures INTEGER,
    total_usage INTEGER,
    most_used_gesture TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_gestures,
        COUNT(*) FILTER (WHERE is_active = true)::INTEGER as active_gestures,
        COALESCE(SUM(usage_count), 0)::INTEGER as total_usage,
        (SELECT name FROM public.custom_gestures 
         WHERE user_id = user_uuid 
         ORDER BY usage_count DESC 
         LIMIT 1) as most_used_gesture
    FROM public.custom_gestures
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create storage bucket for user avatars (optional)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );