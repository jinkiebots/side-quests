-- Add archived field to sticky_notes table
ALTER TABLE sticky_notes ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Create index for faster queries on archived field
CREATE INDEX IF NOT EXISTS idx_sticky_notes_archived ON sticky_notes(archived);

-- Add sticky_variant field for random sticky SVG rotation
ALTER TABLE sticky_notes ADD COLUMN IF NOT EXISTS sticky_variant INTEGER;

-- Update the RLS policy to allow archiving (updates)
CREATE POLICY "Allow public update access" ON sticky_notes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
