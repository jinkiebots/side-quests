import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAndArchiveTest2() {
  console.log('Creating "test 2" sticky note...');

  // Create the sticky note
  const { data: newNote, error: createError } = await supabase
    .from('sticky_notes')
    .insert({
      text: 'test 2',
      image: null,
      doodle: null,
      position_x: 100,
      position_y: 100,
      rotation: 2,
      color: '#ff9800',
      sticky_variant: 1,
      archived: false
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating note:', createError);
    return;
  }

  console.log(`Created "test 2" with ID: ${newNote.id}`);
  console.log('Now archiving it...');

  // Archive it
  const { error: archiveError } = await supabase
    .from('sticky_notes')
    .update({ archived: true })
    .eq('id', newNote.id);

  if (archiveError) {
    console.error('Error archiving note:', archiveError);
  } else {
    console.log('Successfully archived "test 2"!');
  }
}

createAndArchiveTest2();
