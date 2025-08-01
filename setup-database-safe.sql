-- Fortune App Database Setup Script (Safe Version)
-- 安全版本 - 避免重复创建错误
-- Run this script in your Supabase SQL Editor to set up all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own sign-ins" ON public.sign_ins;
DROP POLICY IF EXISTS "Users can insert own sign-ins" ON public.sign_ins;
DROP POLICY IF EXISTS "Users can view own fortunes" ON public.daily_fortunes;
DROP POLICY IF EXISTS "Users can insert own fortunes" ON public.daily_fortunes;
DROP POLICY IF EXISTS "Anyone can view wishes" ON public.wishes;
DROP POLICY IF EXISTS "Authenticated users can insert wishes" ON public.wishes;
DROP POLICY IF EXISTS "Users can update own wishes" ON public.wishes;
DROP POLICY IF EXISTS "Users can delete own wishes" ON public.wishes;
DROP POLICY IF EXISTS "Users can view own likes" ON public.wish_likes;
DROP POLICY IF EXISTS "Users can insert own likes" ON public.wish_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON public.wish_likes;
DROP POLICY IF EXISTS "Users can view own divination history" ON public.divination_history;
DROP POLICY IF EXISTS "Users can insert own divination history" ON public.divination_history;

-- Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 用户表 (Users Table)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  sign_in_streak INTEGER DEFAULT 0,
  total_sign_ins INTEGER DEFAULT 0
);

-- 签到记录表 (Sign-in Records)
CREATE TABLE IF NOT EXISTS public.sign_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 每日运势表 (Daily Fortunes)
CREATE TABLE IF NOT EXISTS public.daily_fortunes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fortune_type TEXT NOT NULL,
  fortune_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 许愿表 (Wishes)
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点赞记录表 (Wish Likes)
CREATE TABLE IF NOT EXISTS public.wish_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, wish_id)
);

-- 占卜历史表 (Divination History)
CREATE TABLE IF NOT EXISTS public.divination_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  question TEXT NOT NULL,
  result TEXT NOT NULL,
  reading_type TEXT,
  input_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sign_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_fortunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divination_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Fresh creation)

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Sign-ins policies
CREATE POLICY "Users can view own sign-ins" ON public.sign_ins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sign-ins" ON public.sign_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily fortunes policies
CREATE POLICY "Users can view own fortunes" ON public.daily_fortunes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fortunes" ON public.daily_fortunes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishes policies
CREATE POLICY "Anyone can view wishes" ON public.wishes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert wishes" ON public.wishes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own wishes" ON public.wishes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishes" ON public.wishes
  FOR DELETE USING (auth.uid() = user_id);

-- Wish likes policies
CREATE POLICY "Users can view own likes" ON public.wish_likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes" ON public.wish_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.wish_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Divination history policies
CREATE POLICY "Users can view own divination history" ON public.divination_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own divination history" ON public.divination_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle the case where username already exists
    INSERT INTO public.users (id, email, username)
    VALUES (
      NEW.id,
      NEW.email,
      split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 8)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT '✅ 数据库安全设置完成！现在可以正常使用认证功能了。' as message;