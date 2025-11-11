import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteAllActive() {
  console.log('Fetching all active (non-archived) stickies...');
  
  const { data: notes, error: fetchError } = await supabase
    .from('sticky_notes')
    .select('id, text')
    .eq('archived', false);

  if (fetchError) {
    console.error('Error fetching notes:', fetchError);
    return;
  }

  console.log(`Found ${notes.length} active stickies`);

  if (notes.length === 0) {
    console.log('No active stickies to delete!');
    return;
  }

  console.log('Deleting all active stickies...');

  const { error: deleteError } = await supabase
    .from('sticky_notes')
    .delete()
    .eq('archived', false);

  if (deleteError) {
    console.error('Error deleting notes:', deleteError);
  } else {
    console.log('Successfully deleted all active stickies!');
  }
}

deleteAllActive();
