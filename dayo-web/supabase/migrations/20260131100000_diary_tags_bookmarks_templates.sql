-- Add tags, bookmarked, and template_id columns to days table
-- This is an additive migration - all defaults preserve existing behavior

ALTER TABLE days ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE days ADD COLUMN IF NOT EXISTS bookmarked BOOLEAN DEFAULT false;
ALTER TABLE days ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT null;

-- Index for tag-based queries (GIN index for array containment)
CREATE INDEX IF NOT EXISTS idx_days_tags ON days USING GIN (tags) WHERE tags != '{}';

-- Index for bookmarked entries
CREATE INDEX IF NOT EXISTS idx_days_bookmarked ON days (user_id, date) WHERE bookmarked = true;
