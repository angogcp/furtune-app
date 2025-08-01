-- 专业功能扩展：大师咨询和报告分享
-- 创建时间：2024年

-- 大师信息表
CREATE TABLE IF NOT EXISTS masters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar TEXT,
  specialties TEXT[] DEFAULT '{}', -- 专长领域
  rating DECIMAL(3,2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  experience_years INTEGER DEFAULT 0,
  consultation_count INTEGER DEFAULT 0,
  price_per_session DECIMAL(10,2) DEFAULT 0,
  is_online BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 咨询会话表
CREATE TABLE IF NOT EXISTS consultation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  master_id UUID REFERENCES masters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  topic VARCHAR(200) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  master_notes TEXT, -- 大师备注
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 用户评分
  feedback TEXT, -- 用户反馈
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 咨询消息表（聊天记录）
CREATE TABLE IF NOT EXISTS consultation_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES consultation_sessions(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'master')),
  sender_id UUID NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- 额外信息（如文件URL等）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 分析报告表
CREATE TABLE IF NOT EXISTS analysis_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  divination_id UUID, -- 关联的占卜记录ID
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(200),
  report_data JSONB NOT NULL, -- 报告详细内容
  template_type VARCHAR(50) DEFAULT 'standard',
  is_shared BOOLEAN DEFAULT false,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 报告分享记录表
CREATE TABLE IF NOT EXISTS report_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES analysis_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  share_platform VARCHAR(50), -- 分享平台（微信、朋友圈、微博等）
  share_type VARCHAR(20) DEFAULT 'link' CHECK (share_type IN ('link', 'image', 'pdf', 'text')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 大师评价表
CREATE TABLE IF NOT EXISTS master_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  master_id UUID REFERENCES masters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES consultation_sessions(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id) -- 每个会话只能评价一次
);

-- 大师收入记录表
CREATE TABLE IF NOT EXISTS master_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  master_id UUID REFERENCES masters(id) ON DELETE CASCADE,
  session_id UUID REFERENCES consultation_sessions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,4) DEFAULT 0.1, -- 平台抽成比例
  commission_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL, -- 大师实际收入
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_masters_rating ON masters(rating DESC);
CREATE INDEX IF NOT EXISTS idx_masters_online ON masters(is_online, is_active);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_user ON consultation_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_master ON consultation_sessions(master_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_status ON consultation_sessions(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_session ON consultation_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_user ON analysis_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_shares_report ON report_shares(report_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_master_reviews_master ON master_reviews(master_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_master_earnings_master ON master_earnings(master_id, created_at DESC);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
DROP TRIGGER IF EXISTS update_masters_updated_at ON masters;
CREATE TRIGGER update_masters_updated_at
    BEFORE UPDATE ON masters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultation_sessions_updated_at ON consultation_sessions;
CREATE TRIGGER update_consultation_sessions_updated_at
    BEFORE UPDATE ON consultation_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_analysis_reports_updated_at ON analysis_reports;
CREATE TRIGGER update_analysis_reports_updated_at
    BEFORE UPDATE ON analysis_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入示例大师数据
INSERT INTO masters (name, avatar, specialties, rating, experience_years, consultation_count, price_per_session, is_online, description) VALUES
('李玄机', '/avatars/master1.jpg', ARRAY['塔罗牌', '易经', '星座'], 4.9, 15, 1250, 188.00, true, '资深塔罗师，精通易经八卦，擅长情感咨询和事业指导。从业15年，帮助过上千位求问者找到人生方向。'),
('王慧心', '/avatars/master2.jpg', ARRAY['紫微斗数', '手相', '面相'], 4.8, 12, 980, 158.00, true, '紫微斗数专家，精通传统相术。温和耐心，善于倾听，为您解读命运密码，指引人生迷津。'),
('张明德', '/avatars/master3.jpg', ARRAY['奇门遁甲', '风水', '择日'], 4.7, 20, 1580, 288.00, false, '奇门遁甲大师，风水堪舆专家。二十年实战经验，精通古法择日，为企业和个人提供专业咨询服务。'),
('陈灵儿', '/avatars/master4.jpg', ARRAY['塔罗牌', '水晶占卜', '灵性指导'], 4.9, 8, 750, 128.00, true, '新生代塔罗师，结合现代心理学与古老智慧。擅长情感疗愈和灵性成长指导，深受年轻人喜爱。'),
('刘天师', '/avatars/master5.jpg', ARRAY['六爻', '梅花易数', '姓名学'], 4.6, 25, 2100, 368.00, true, '易学泰斗，六爻预测专家。从事易学研究25年，著有多部易学专著，预测准确率极高。');

-- 创建获取大师列表的函数
CREATE OR REPLACE FUNCTION get_masters_list(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_specialty TEXT DEFAULT NULL,
  p_online_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  avatar TEXT,
  specialties TEXT[],
  rating DECIMAL,
  experience_years INTEGER,
  consultation_count INTEGER,
  price_per_session DECIMAL,
  is_online BOOLEAN,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.avatar,
    m.specialties,
    m.rating,
    m.experience_years,
    m.consultation_count,
    m.price_per_session,
    m.is_online,
    m.description
  FROM masters m
  WHERE 
    m.is_active = true
    AND (p_specialty IS NULL OR p_specialty = ANY(m.specialties))
    AND (p_online_only = false OR m.is_online = true)
  ORDER BY m.rating DESC, m.consultation_count DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 创建更新大师评分的函数
CREATE OR REPLACE FUNCTION update_master_rating(p_master_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL;
  review_count INTEGER;
BEGIN
  SELECT 
    COALESCE(AVG(rating), 5.0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM master_reviews
  WHERE master_id = p_master_id;
  
  UPDATE masters
  SET 
    rating = avg_rating,
    updated_at = NOW()
  WHERE id = p_master_id;
END;
$$ LANGUAGE plpgsql;

-- 创建咨询会话完成后的触发器
CREATE OR REPLACE FUNCTION handle_session_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- 如果会话状态变为已完成，更新大师的咨询次数
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE masters
    SET 
      consultation_count = consultation_count + 1,
      updated_at = NOW()
    WHERE id = NEW.master_id;
    
    -- 创建收入记录
    INSERT INTO master_earnings (master_id, session_id, amount, commission_amount, net_amount)
    VALUES (
      NEW.master_id,
      NEW.id,
      NEW.price,
      NEW.price * 0.1, -- 10%平台抽成
      NEW.price * 0.9
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_session_completion ON consultation_sessions;
CREATE TRIGGER trigger_session_completion
  AFTER UPDATE ON consultation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION handle_session_completion();

-- 创建大师评价后更新评分的触发器
CREATE OR REPLACE FUNCTION handle_master_review()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新大师评分
  PERFORM update_master_rating(NEW.master_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_master_review ON master_reviews;
CREATE TRIGGER trigger_master_review
  AFTER INSERT OR UPDATE ON master_reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_master_review();

-- 创建获取用户咨询历史的函数
CREATE OR REPLACE FUNCTION get_user_consultation_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  master_name VARCHAR,
  master_avatar TEXT,
  topic VARCHAR,
  status VARCHAR,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  price DECIMAL,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cs.id,
    m.name as master_name,
    m.avatar as master_avatar,
    cs.topic,
    cs.status,
    cs.scheduled_at,
    cs.duration_minutes,
    cs.price,
    cs.rating,
    cs.created_at
  FROM consultation_sessions cs
  JOIN masters m ON cs.master_id = m.id
  WHERE cs.user_id = p_user_id
  ORDER BY cs.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 创建生成分析报告的函数
CREATE OR REPLACE FUNCTION create_analysis_report(
  p_user_id UUID,
  p_divination_id UUID,
  p_title VARCHAR,
  p_subtitle VARCHAR,
  p_report_data JSONB,
  p_template_type VARCHAR DEFAULT 'standard'
)
RETURNS UUID AS $$
DECLARE
  report_id UUID;
BEGIN
  INSERT INTO analysis_reports (
    user_id,
    divination_id,
    title,
    subtitle,
    report_data,
    template_type
  ) VALUES (
    p_user_id,
    p_divination_id,
    p_title,
    p_subtitle,
    p_report_data,
    p_template_type
  ) RETURNING id INTO report_id;
  
  RETURN report_id;
END;
$$ LANGUAGE plpgsql;

-- 创建记录报告分享的函数
CREATE OR REPLACE FUNCTION record_report_share(
  p_report_id UUID,
  p_user_id UUID,
  p_share_platform VARCHAR,
  p_share_type VARCHAR DEFAULT 'link'
)
RETURNS VOID AS $$
BEGIN
  -- 记录分享
  INSERT INTO report_shares (report_id, user_id, share_platform, share_type)
  VALUES (p_report_id, p_user_id, p_share_platform, p_share_type);
  
  -- 更新报告分享次数
  UPDATE analysis_reports
  SET 
    share_count = share_count + 1,
    is_shared = true,
    updated_at = NOW()
  WHERE id = p_report_id;
END;
$$ LANGUAGE plpgsql;

-- 设置RLS策略
ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_earnings ENABLE ROW LEVEL SECURITY;

-- 大师表策略（所有人可查看活跃大师）
CREATE POLICY "Masters are viewable by everyone" ON masters
  FOR SELECT USING (is_active = true);

-- 咨询会话策略（用户只能查看自己的会话）
CREATE POLICY "Users can view own consultation sessions" ON consultation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consultation sessions" ON consultation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultation sessions" ON consultation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- 咨询消息策略
CREATE POLICY "Users can view messages from their sessions" ON consultation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM consultation_sessions cs
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their sessions" ON consultation_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultation_sessions cs
      WHERE cs.id = session_id AND cs.user_id = auth.uid()
    ) AND sender_id = auth.uid()
  );

-- 分析报告策略
CREATE POLICY "Users can view own analysis reports" ON analysis_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis reports" ON analysis_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis reports" ON analysis_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- 报告分享策略
CREATE POLICY "Users can view own report shares" ON report_shares
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report shares" ON report_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 大师评价策略
CREATE POLICY "Users can view all master reviews" ON master_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own master reviews" ON master_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own master reviews" ON master_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- 大师收入策略（仅大师可查看自己的收入）
CREATE POLICY "Masters can view own earnings" ON master_earnings
  FOR SELECT USING (false); -- 暂时禁用，需要大师身份验证系统

COMMIT;