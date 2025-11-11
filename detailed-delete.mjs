import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function detailedDelete() {
  const { data: notes } = await supabase.from('sticky_notes').select('id').limit(1);
  
  if (!notes || notes.length === 0) {
    console.log('No notes found');
    return;
  }
  
  const testId = notes[0].id;
  console.log('Attempting to delete note:', testId);
  
  const result = await supabase
    .from('sticky_notes')
    .delete()
    .eq('id', testId);
  
  console.log('Delete result:', JSON.stringify(result, null, 2));
}

detailedDelete();
