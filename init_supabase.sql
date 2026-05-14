-- 课文漫游数据库初始化脚本
-- 在 Supabase SQL Editor 中执行
-- 版本: v2 - 带用户管理和审查机制

-- ============================================
-- 删除旧表（如果需要重新初始化）
-- ============================================
-- DROP TABLE IF EXISTS works CASCADE;
-- DROP TABLE IF EXISTS lessons CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- 创建 profiles 表（用户资料）
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 修改 works 表（作品）
-- ============================================
-- 添加审查相关字段（如果列不存在则添加）
DO $$ BEGIN
  ALTER TABLE works ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected'));
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE works ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE works ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- ============================================
-- 创建 lessons 表（课文）
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending',
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  ai_prompt JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 创建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_works_review_status ON works(review_status);
CREATE INDEX IF NOT EXISTS idx_works_user_id ON works(user_id);
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_user_id ON lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON lessons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- 启用 RLS（行级安全策略）
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- profiles 表策略
-- ============================================
-- 允许任何人读取 profiles（显示作者信息）
CREATE POLICY "anyone_read_profiles" ON profiles
  FOR SELECT USING (true);

-- 用户只能更新自己的 profile
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 用户创建自己的 profile
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- works 表策略
-- ============================================
-- 允许所有人读取已审核通过的作品
CREATE POLICY "anyone_read_approved_works" ON works
  FOR SELECT USING (is_public = true AND review_status = 'approved');

-- 允许认证用户查看自己的所有作品
CREATE POLICY "users_read_own_works" ON works
  FOR SELECT USING (auth.uid() = user_id);

-- 允许认证用户创建作品
CREATE POLICY "users_insert_works" ON works
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 允许用户更新自己的作品
CREATE POLICY "owner_update_works" ON works
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许用户删除自己的作品
CREATE POLICY "owner_delete_works" ON works
  FOR DELETE USING (auth.uid() = user_id);

-- 允许管理员操作所有作品
CREATE POLICY "admin_all_works" ON works
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- lessons 表策略
-- ============================================
-- 允许任何人读取课文
CREATE POLICY "anyone_read_lessons" ON lessons
  FOR SELECT USING (true);

-- 允许认证用户创建课文
CREATE POLICY "users_insert_lessons" ON lessons
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 允许用户更新自己的课文
CREATE POLICY "owner_update_lessons" ON lessons
  FOR UPDATE USING (auth.uid() = user_id);

-- 允许用户删除自己的课文
CREATE POLICY "owner_delete_lessons" ON lessons
  FOR DELETE USING (auth.uid() = user_id);

-- 允许管理员操作所有课文
CREATE POLICY "admin_all_lessons" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 自动创建 profile 的 trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 当 auth.users 创建新用户时自动创建 profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 管理员账号设置（可选）
-- ============================================
-- 将某个用户设为管理员：
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
