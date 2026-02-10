-- Add visual_theme column to user_profiles
-- Supports: 'default', 'night-ritual', 'diary', 'private-notebook', 'cosmic-calm'

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS visual_theme TEXT DEFAULT 'default';

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.visual_theme IS 'Visual theme preference: default, night-ritual, diary, private-notebook, cosmic-calm';
