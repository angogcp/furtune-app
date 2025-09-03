-- Migration to add personal information fields to users table
-- Add personal information columns for fortune telling

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS time_of_birth TIME,
ADD COLUMN IF NOT EXISTS place_of_birth TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_date_of_birth ON users(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);

-- Update RLS policies to include new fields
CREATE POLICY "Users can update own personal info" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Comment on columns for documentation
COMMENT ON COLUMN users.full_name IS 'User full name for fortune telling';
COMMENT ON COLUMN users.date_of_birth IS 'User birth date for astrological calculations';
COMMENT ON COLUMN users.time_of_birth IS 'User birth time for precise fortune telling';
COMMENT ON COLUMN users.place_of_birth IS 'User birth location for geographical fortune telling';
COMMENT ON COLUMN users.gender IS 'User gender (male/female) for personalized fortune telling';