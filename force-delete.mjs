import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function forceDelete() {
  try {
    console.log('Fetching all notes...');
    const { data: notes, error: fetchError } = await supabase
      .from('sticky_notes')
      .select('id');
    
    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return;
    }
    
    console.log('Found ' + notes.length + ' notes');
    
    // Delete each note individually
    for (const note of notes) {
      console.log('Deleting note:', note.id);
      const { error: delError } = await supabase
        .from('sticky_notes')
        .delete()
        .eq('id', note.id);
      
      if (delError) {
        console.error('Error deleting note ' + note.id + ':', delError);
      }
    }
    
    console.log('Deletion complete!');
    
    // Verify
    const { data: remaining } = await supabase.from('sticky_notes').select('id');
    console.log('Remaining notes:', remaining ? remaining.length : 0);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

forceDelete();
