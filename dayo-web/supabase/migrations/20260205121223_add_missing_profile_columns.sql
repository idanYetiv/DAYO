-- =============================================
-- ADD MISSING PROFILE COLUMNS
-- Adds background_image, profile_type, and onboarding_completed
-- that were defined in types but missing from schema
-- =============================================

-- Add profile_type column (adult or kid mode)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS profile_type TEXT DEFAULT 'adult'
CHECK (profile_type IN ('adult', 'kid'));

-- Add onboarding_completed column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add background_image column (stores gradient CSS or data URL)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Update existing rows to have default values
UPDATE user_profiles
SET profile_type = 'adult'
WHERE profile_type IS NULL;

UPDATE user_profiles
SET onboarding_completed = TRUE
WHERE onboarding_completed IS NULL;
