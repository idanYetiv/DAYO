-- =============================================
-- GOALS TABLE
-- =============================================
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('yearly', 'monthly', 'weekly')),
  color TEXT DEFAULT '#8B5CF6',
  icon TEXT DEFAULT '🎯',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- MILESTONES TABLE
-- =============================================
CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for milestones
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own milestones"
  ON milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own milestones"
  ON milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON milestones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones"
  ON milestones FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX goals_user_id_idx ON goals(user_id);
CREATE INDEX goals_category_idx ON goals(category);
CREATE INDEX milestones_goal_id_idx ON milestones(goal_id);
CREATE INDEX milestones_user_id_idx ON milestones(user_id);
