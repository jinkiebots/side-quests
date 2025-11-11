import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteAllArchived() {
  console.log('Fetching all archived stickies...');
  
  const { data: notes, error: fetchError } = await supabase
    .from('sticky_notes')
    .select('id, text')
    .eq('archived', true);

  if (fetchError) {
    console.error('Error fetching notes:', fetchError);
    return;
  }

  console.log(`Found ${notes.length} archived stickies`);

  if (notes.length === 0) {
    console.log('No archived stickies to delete!');
    return;
  }

  console.log('Deleting all archived stickies...');

  const { error: deleteError } = await supabase
    .from('sticky_notes')
    .delete()
    .eq('archived', true);

  if (deleteError) {
    console.error('Error deleting notes:', deleteError);
  } else {
    console.log('Successfully deleted all archived stickies!');
  }
}

deleteAllArchived();
