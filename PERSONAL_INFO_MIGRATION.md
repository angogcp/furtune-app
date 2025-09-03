# Database Migration Guide - Personal Information Fields

## Issue
The application cannot save personal information because the database schema is missing the required columns.

## Solution
You need to apply the database migration to add the personal information fields to your Supabase database.

## Steps to Fix

### Option 1: Apply Migration via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**:
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**:
   - Click on "SQL Editor" in the left sidebar

3. **Execute Migration Script**:
   - Copy the content from `database/add_personal_info_migration.sql`
   - Paste it into the SQL Editor
   - Click "RUN" to execute

### Option 2: Apply Migration via Database Connection

If you have direct database access:

```sql
-- Add personal information columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS time_of_birth TIME,
ADD COLUMN IF NOT EXISTS place_of_birth TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_date_of_birth ON users(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
```

## Verification

After applying the migration, verify the columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('full_name', 'date_of_birth', 'time_of_birth', 'place_of_birth', 'gender');
```

## New User Tables Structure

After migration, your users table will include:

- `id` - UUID Primary Key
- `email` - User email (unique)
- `username` - Username (unique)
- `created_at` - Account creation timestamp
- `last_sign_in` - Last sign in timestamp
- `sign_in_streak` - Consecutive sign-in days
- `total_sign_ins` - Total sign-in count
- **`full_name`** - User's full name
- **`date_of_birth`** - Date of birth (DATE)
- **`time_of_birth`** - Time of birth (TIME)
- **`place_of_birth`** - Place of birth (TEXT)
- **`gender`** - Gender (male/female)

## Testing

1. Apply the migration
2. Restart your application (`npm run dev`)
3. Navigate to Profile page
4. Try editing and saving personal information
5. The error should be resolved

## Notes

- The migration is safe and won't affect existing data
- New columns are optional (nullable)
- Existing users will have empty personal information until they fill it out
- The migration script uses `IF NOT EXISTS` to prevent errors if columns already exist