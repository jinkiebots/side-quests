import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteAllStickyNotes() {
  try {
    console.log('Fetching all sticky notes...');
    const result = await supabase.from('sticky_notes').select('id');
    
    if (result.error) {
      console.error('Error:', result.error);
      process.exit(1);
    }
    
    const count = result.data ? result.data.length : 0;
    console.log('Found ' + count + ' sticky notes.');
    
    if (count === 0) {
      console.log('No sticky notes to delete.');
      process.exit(0);
    }
    
    console.log('Deleting all sticky notes...');
    const deleteResult = await supabase.from('sticky_notes').delete().gte('created_at', '1900-01-01');
    
    if (deleteResult.error) {
      console.error('Error deleting:', deleteResult.error);
      process.exit(1);
    }
    
    console.log('Successfully deleted all sticky notes!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

deleteAllStickyNotes();
