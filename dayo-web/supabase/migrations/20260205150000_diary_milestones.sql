-- Migration: Add diary milestone tracking columns to user_stats
-- Created: 2026-02-05

-- Add milestone tracking columns to user_stats
ALTER TABLE user_stats
ADD COLUMN IF NOT EXISTS total_diary_entries INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS milestones_achieved JSONB DEFAULT '[]'::jsonb;

-- Create index for faster milestone queries
CREATE INDEX IF NOT EXISTS idx_user_stats_milestones ON user_stats USING gin (milestones_achieved);

-- Add comment for documentation
COMMENT ON COLUMN user_stats.total_diary_entries IS 'Total number of diary entries written by the user';
COMMENT ON COLUMN user_stats.total_word_count IS 'Total words written across all diary entries';
COMMENT ON COLUMN user_stats.milestones_achieved IS 'Array of achieved milestone IDs: first_entry, words_100, words_1000, words_10000';
