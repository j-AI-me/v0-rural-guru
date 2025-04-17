-- Add new columns to properties table if they don't exist
ALTER TABLE IF EXISTS properties 
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS amenities TEXT[],
ADD COLUMN IF NOT EXISTS adapted_mobility BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index on type for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- Create index on adapted_mobility for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_adapted_mobility ON properties(adapted_mobility);
