-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  sign_in_streak INTEGER DEFAULT 0,
  total_sign_ins INTEGER DEFAULT 0,
  -- Personal information for fortune telling
  full_name TEXT,
  date_of_birth DATE,
  time_of_birth TIME,
  place_of_birth TEXT,
  gender TEXT CHECK (gender IN ('male', 'female'))
);

-- 签到记录表
CREATE TABLE IF NOT EXISTS sign_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 每日运势表
CREATE TABLE IF NOT EXISTS daily_fortunes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  fortune_type TEXT NOT NULL,
  fortune_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 许愿表
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 点赞记录表（防止重复点赞）
CREATE TABLE IF NOT EXISTS wish_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wish_id UUID REFERENCES wishes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, wish_id)
);

-- 占卜历史记录表
CREATE TABLE IF NOT EXISTS divination_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  result TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sign_ins_user_date ON sign_ins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_fortunes_user_date ON daily_fortunes(user_id, date);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_divination_history_user ON divination_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_date_of_birth ON users(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_fortunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE divination_history ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 签到记录策略
CREATE POLICY "Users can view own sign-ins" ON sign_ins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sign-ins" ON sign_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 每日运势策略
CREATE POLICY "Users can view own fortunes" ON daily_fortunes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fortunes" ON daily_fortunes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 许愿表策略
CREATE POLICY "Anyone can view wishes" ON wishes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert wishes" ON wishes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own wishes" ON wishes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishes" ON wishes
  FOR DELETE USING (auth.uid() = user_id);

-- 点赞记录策略
CREATE POLICY "Users can view own likes" ON wish_likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes" ON wish_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON wish_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 占卜历史策略
CREATE POLICY "Users can view own divination history" ON divination_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own divination history" ON divination_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建触发器函数：自动创建用户资料
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：用户注册时自动创建资料
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建函数：更新许愿点赞数
CREATE OR REPLACE FUNCTION update_wish_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE wishes SET likes = likes + 1 WHERE id = NEW.wish_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE wishes SET likes = likes - 1 WHERE id = OLD.wish_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：自动更新许愿点赞数
CREATE OR REPLACE TRIGGER wish_likes_count_trigger
  AFTER INSERT OR DELETE ON wish_likes
  FOR EACH ROW EXECUTE FUNCTION update_wish_likes_count();