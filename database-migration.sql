-- Migration to make nickname unique and add constraints
-- Run this in your Supabase SQL Editor

-- Add unique constraint to nickname
ALTER TABLE users ADD CONSTRAINT users_nickname_unique UNIQUE (nickname);

-- Optional: Add index for better performance on nickname lookups
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Update any existing duplicate nicknames (if any)
-- This will add numbers to make them unique
WITH ranked_users AS (
  SELECT 
    id, 
    nickname,
    ROW_NUMBER() OVER (PARTITION BY nickname ORDER BY created_at) as rn
  FROM users
  WHERE nickname IS NOT NULL
),
updates AS (
  SELECT 
    id,
    CASE 
      WHEN rn = 1 THEN nickname
      ELSE nickname || '_' || rn
    END as new_nickname
  FROM ranked_users
  WHERE rn > 1
)
UPDATE users 
SET nickname = updates.new_nickname
FROM updates
WHERE users.id = updates.id;
