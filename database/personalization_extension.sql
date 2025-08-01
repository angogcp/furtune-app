-- 个性化推荐与沉浸体验功能扩展
-- 在现有数据库基础上添加新表和功能

-- 用户偏好设置表
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferred_methods TEXT[] DEFAULT '{}', -- 偏好的占卜方法
  preferred_types TEXT[] DEFAULT '{}', -- 偏好的咨询类型
  notification_settings JSONB DEFAULT '{}', -- 通知设置
  theme_preferences JSONB DEFAULT '{}', -- 主题偏好
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 占卜结果存档表（扩展原有divination_history）
ALTER TABLE divination_history ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE divination_history ADD COLUMN IF NOT EXISTS mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5);
ALTER TABLE divination_history ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE divination_history ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE divination_history ADD COLUMN IF NOT EXISTS accuracy_feedback INTEGER CHECK (accuracy_feedback >= 1 AND accuracy_feedback <= 5);

-- 成长记录表
CREATE TABLE IF NOT EXISTS growth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL, -- 'milestone', 'achievement', 'insight'
  title TEXT NOT NULL,
  description TEXT,
  data JSONB DEFAULT '{}', -- 存储相关数据
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 命运变化提醒表
CREATE TABLE IF NOT EXISTS fortune_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'monthly', 'yearly', 'custom'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  trigger_date DATE NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 个性化推荐内容表
CREATE TABLE IF NOT EXISTS recommendation_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'article', 'tip', 'ritual', 'meditation'
  tags TEXT[] DEFAULT '{}',
  target_methods TEXT[] DEFAULT '{}', -- 适用的占卜方法
  target_types TEXT[] DEFAULT '{}', -- 适用的咨询类型
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户推荐记录表
CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES recommendation_content(id) ON DELETE CASCADE,
  recommended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_bookmarked BOOLEAN DEFAULT FALSE
);

-- 用户成就系统表
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  condition_type TEXT NOT NULL, -- 'divination_count', 'streak_days', 'method_variety', etc.
  condition_value INTEGER NOT NULL,
  reward_points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户成就记录表
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 用户积分表
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 积分变动记录表
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earn', 'spend'
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID, -- 关联的记录ID（如占卜记录、成就等）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_user_date ON growth_records(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_fortune_reminders_trigger_date ON fortune_reminders(trigger_date, is_sent);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id, recommended_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_divination_history_tags ON divination_history USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recommendation_content_tags ON recommendation_content USING GIN(tags);

-- 启用行级安全策略
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- 用户偏好策略
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- 成长记录策略
CREATE POLICY "Users can manage own growth records" ON growth_records
  FOR ALL USING (auth.uid() = user_id);

-- 命运提醒策略
CREATE POLICY "Users can manage own reminders" ON fortune_reminders
  FOR ALL USING (auth.uid() = user_id);

-- 推荐内容策略（管理员可管理，用户只读）
CREATE POLICY "Anyone can view active content" ON recommendation_content
  FOR SELECT USING (is_active = true);

-- 用户推荐记录策略
CREATE POLICY "Users can manage own recommendations" ON user_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- 成就系统策略
CREATE POLICY "Anyone can view active achievements" ON achievements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements" ON user_achievements
  FOR INSERT WITH CHECK (true); -- 由系统触发器管理

-- 积分系统策略
CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user points" ON user_points
  FOR ALL USING (true); -- 由系统触发器管理

CREATE POLICY "Users can view own transactions" ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON point_transactions
  FOR INSERT WITH CHECK (true); -- 由系统触发器管理

-- 创建触发器函数：自动创建用户偏好和积分记录
CREATE OR REPLACE FUNCTION create_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- 创建用户偏好记录
  INSERT INTO user_preferences (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- 创建用户积分记录
  INSERT INTO user_points (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：用户创建时自动初始化
CREATE OR REPLACE TRIGGER on_user_defaults_created
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_defaults();

-- 创建函数：更新用户积分和等级
CREATE OR REPLACE FUNCTION update_user_points(user_uuid UUID, point_change INTEGER, reason TEXT, ref_id UUID DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  current_points INTEGER;
  new_level INTEGER;
BEGIN
  -- 插入积分变动记录
  INSERT INTO point_transactions (user_id, transaction_type, points, reason, reference_id)
  VALUES (user_uuid, CASE WHEN point_change > 0 THEN 'earn' ELSE 'spend' END, ABS(point_change), reason, ref_id);
  
  -- 更新用户积分
  UPDATE user_points 
  SET 
    points = GREATEST(0, points + point_change),
    experience = GREATEST(0, experience + CASE WHEN point_change > 0 THEN point_change ELSE 0 END),
    updated_at = NOW()
  WHERE user_id = user_uuid
  RETURNING points INTO current_points;
  
  -- 计算新等级（每100积分升一级）
  new_level := GREATEST(1, current_points / 100 + 1);
  
  -- 更新等级
  UPDATE user_points 
  SET level = new_level
  WHERE user_id = user_uuid AND level != new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：检查并授予成就
CREATE OR REPLACE FUNCTION check_achievements(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  achievement_record RECORD;
  user_count INTEGER;
BEGIN
  FOR achievement_record IN SELECT * FROM achievements WHERE is_active = true LOOP
    -- 检查用户是否已获得此成就
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = user_uuid AND achievement_id = achievement_record.id) THEN
      
      -- 根据成就条件类型检查
      CASE achievement_record.condition_type
        WHEN 'divination_count' THEN
          SELECT COUNT(*) INTO user_count FROM divination_history WHERE user_id = user_uuid;
          
        WHEN 'streak_days' THEN
          SELECT sign_in_streak INTO user_count FROM users WHERE id = user_uuid;
          
        WHEN 'method_variety' THEN
          SELECT COUNT(DISTINCT method) INTO user_count FROM divination_history WHERE user_id = user_uuid;
          
        ELSE
          user_count := 0;
      END CASE;
      
      -- 如果满足条件，授予成就
      IF user_count >= achievement_record.condition_value THEN
        INSERT INTO user_achievements (user_id, achievement_id) VALUES (user_uuid, achievement_record.id);
        
        -- 奖励积分
        IF achievement_record.reward_points > 0 THEN
          PERFORM update_user_points(user_uuid, achievement_record.reward_points, '获得成就: ' || achievement_record.name, achievement_record.id);
        END IF;
        
        -- 记录成长记录
        INSERT INTO growth_records (user_id, record_type, title, description, date)
        VALUES (user_uuid, 'achievement', '获得成就: ' || achievement_record.name, achievement_record.description, CURRENT_DATE);
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：占卜后自动奖励积分和检查成就
CREATE OR REPLACE FUNCTION handle_divination_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- 奖励占卜积分
  PERFORM update_user_points(NEW.user_id, 10, '完成占卜', NEW.id);
  
  -- 检查成就
  PERFORM check_achievements(NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_divination_completed
  AFTER INSERT ON divination_history
  FOR EACH ROW EXECUTE FUNCTION handle_divination_completion();

-- 插入默认成就数据
INSERT INTO achievements (name, description, icon, condition_type, condition_value, reward_points) VALUES
('初次体验', '完成第一次占卜', '🌟', 'divination_count', 1, 50),
('占卜新手', '完成10次占卜', '🔮', 'divination_count', 10, 100),
('占卜达人', '完成50次占卜', '✨', 'divination_count', 50, 300),
('占卜大师', '完成100次占卜', '🎭', 'divination_count', 100, 500),
('坚持不懈', '连续签到7天', '📅', 'streak_days', 7, 200),
('持之以恒', '连续签到30天', '🏆', 'streak_days', 30, 800),
('探索者', '尝试3种不同占卜方法', '🧭', 'method_variety', 3, 150),
('全能占卜师', '尝试所有占卜方法', '👑', 'method_variety', 5, 1000)
ON CONFLICT (name) DO NOTHING;

-- 插入默认推荐内容
INSERT INTO recommendation_content (title, content, content_type, tags, target_methods, difficulty_level) VALUES
('塔罗牌的历史与起源', '塔罗牌起源于15世纪的欧洲，最初作为纸牌游戏使用。现代塔罗占卜体系融合了卡巴拉、占星学、炼金术等神秘学知识...', 'article', '{"塔罗", "历史", "入门"}', '{"tarot"}', 1),
('如何提高占卜准确性', '占卜的准确性不仅取决于技巧，更重要的是占卜师的直觉力和专注度。以下几个方法可以帮助你提升占卜水平...', 'tip', '{"技巧", "准确性", "提升"}', '{"tarot", "astrology", "iching"}', 3),
('冥想净化仪式', '在进行占卜前，通过冥想净化心灵和能量场，可以显著提高占卜的准确性和深度...', 'ritual', '{"冥想", "净化", "仪式"}', '{"tarot", "astrology", "iching", "numerology"}', 2),
('星座运势解读技巧', '学会解读星座运势需要理解行星运行规律、宫位含义以及相位关系。本文将详细介绍基础解读方法...', 'article', '{"占星", "星座", "解读"}', '{"astrology"}', 4),
('易经入门指南', '易经作为中华文化瑰宝，蕴含着深刻的哲学智慧。初学者可以从理解八卦基本含义开始...', 'article', '{"易经", "入门", "八卦"}', '{"iching"}', 2)
ON CONFLICT DO NOTHING;

-- 创建视图：用户成长概览
CREATE OR REPLACE VIEW user_growth_overview AS
SELECT 
  u.id,
  u.username,
  u.created_at as join_date,
  u.sign_in_streak,
  u.total_sign_ins,
  up.points,
  up.level,
  up.experience,
  COUNT(dh.id) as total_divinations,
  COUNT(DISTINCT dh.method) as methods_tried,
  COUNT(ua.id) as achievements_earned,
  COALESCE(AVG(dh.accuracy_feedback), 0) as avg_accuracy_rating
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id
LEFT JOIN divination_history dh ON u.id = dh.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username, u.created_at, u.sign_in_streak, u.total_sign_ins, up.points, up.level, up.experience;

-- 创建函数：生成个性化推荐
CREATE OR REPLACE FUNCTION get_personalized_recommendations(user_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  content_id UUID,
  title TEXT,
  content TEXT,
  content_type TEXT,
  relevance_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.id,
    rc.title,
    rc.content,
    rc.content_type,
    -- 计算相关性分数
    (
      CASE WHEN rc.target_methods && (SELECT preferred_methods FROM user_preferences WHERE user_id = user_uuid) THEN 3 ELSE 0 END +
      CASE WHEN rc.target_types && (SELECT preferred_types FROM user_preferences WHERE user_id = user_uuid) THEN 2 ELSE 0 END +
      CASE WHEN rc.difficulty_level <= (SELECT level FROM user_points WHERE user_id = user_uuid) THEN 1 ELSE 0 END
    ) as relevance_score
  FROM recommendation_content rc
  WHERE rc.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_recommendations ur 
      WHERE ur.user_id = user_uuid AND ur.content_id = rc.id AND ur.viewed_at IS NOT NULL
    )
  ORDER BY relevance_score DESC, rc.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;