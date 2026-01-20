-- =============================================
-- HABITS TABLE
-- =============================================
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '✅',
  color TEXT DEFAULT '#8B5CF6',
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  target_per_week INTEGER DEFAULT 7,
  time_of_day TEXT DEFAULT 'anytime' CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'anytime')),
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for habits
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- HABIT COMPLETIONS TABLE (daily check-offs)
-- =============================================
CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)  -- One completion per habit per day
);

-- RLS for habit_completions
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX habits_user_id_idx ON habits(user_id);
CREATE INDEX habits_archived_idx ON habits(archived);
CREATE INDEX habit_completions_habit_id_idx ON habit_completions(habit_id);
CREATE INDEX habit_completions_user_id_idx ON habit_completions(user_id);
CREATE INDEX habit_completions_date_idx ON habit_completions(date);
CREATE INDEX habit_completions_habit_date_idx ON habit_completions(habit_id, date);
