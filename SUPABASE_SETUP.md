# Supabase Setup for Sticker Club Wall

## Table Structure

Create a table named `sticky_notes` in your Supabase database with the following structure:

### SQL to create the table:

```sql
CREATE TABLE sticky_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT,
  image TEXT,
  doodle TEXT,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  rotation FLOAT DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#ffeb3b',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE sticky_notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read sticky notes
CREATE POLICY "Allow public read access" ON sticky_notes
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert sticky notes
CREATE POLICY "Allow public insert access" ON sticky_notes
  FOR INSERT
  WITH CHECK (true);
```

### Table Columns:

- `id` (UUID): Primary key, auto-generated
- `text` (TEXT): Optional text content on the sticky note
- `image` (TEXT): Optional base64-encoded image data
- `doodle` (TEXT): Optional base64-encoded canvas/doodle data
- `position_x` (FLOAT): X position on the bulletin board
- `position_y` (FLOAT): Y position on the bulletin board
- `rotation` (FLOAT): Rotation angle in degrees (default: 0)
- `color` (TEXT): Sticky note color hex code (default: '#ffeb3b' - yellow)
- `created_at` (TIMESTAMP): Auto-generated timestamp when note is created

## Row Level Security (RLS)

The table uses RLS with policies that allow:
- **Read access**: Anyone can view all sticky notes
- **Insert access**: Anyone can create new sticky notes

This makes the Sticker Club Wall fully anonymous and open for everyone to post!

## Environment Variables (Optional)

If you want to use environment variables instead of hardcoded values in `lib/supabase.ts`, create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://bysjndembewhgpbemijc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

The current setup has the credentials hardcoded in `lib/supabase.ts` as fallbacks, so it will work without environment variables, but using env variables is more secure for production.
