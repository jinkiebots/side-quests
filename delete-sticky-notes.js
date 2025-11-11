const { createClient } = require('@supabase/supabase-js');

// Read Supabase config from environment or use defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllStickyNotes() {
  try {
    console.log('Deleting all sticky notes...');
    
    const { data, error } = await supabase
      .from('sticky_notes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records (using a condition that matches all)
    
    if (error) {
      console.error('Error deleting sticky notes:', error);
      process.exit(1);
    }
    
    console.log('Successfully deleted all sticky notes!');
    console.log('Refresh your browser to see the changes.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

deleteAllStickyNotes();
