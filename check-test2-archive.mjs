import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTest2() {
  const { data: notes, error } = await supabase
    .from('sticky_notes')
    .select('id, text, archived')
    .eq('text', 'test 2');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('All notes with text "test 2":');
  notes.forEach(note => {
    console.log(`- ID: ${note.id}`);
    console.log(`  Archived: ${note.archived}`);
  });
}

checkTest2();
