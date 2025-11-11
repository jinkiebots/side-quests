import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function archiveTest2() {
  // Find the note with text "test 2"
  const { data: notes, error: fetchError } = await supabase
    .from('sticky_notes')
    .select('id, text')
    .eq('text', 'test 2');

  if (fetchError) {
    console.error('Error fetching notes:', fetchError);
    return;
  }

  if (!notes || notes.length === 0) {
    console.log('No note found with text "test 2"');
    return;
  }

  const noteId = notes[0].id;
  console.log(`Found "test 2" note with ID: ${noteId}`);
  console.log('Archiving it...');

  const { error: updateError } = await supabase
    .from('sticky_notes')
    .update({ archived: true })
    .eq('id', noteId);

  if (updateError) {
    console.error('Error archiving note:', updateError);
  } else {
    console.log('Successfully archived "test 2"!');
  }
}

archiveTest2();
