import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixExistingVariants() {
  console.log('Fetching notes without sticky_variant...');

  const { data: notes, error } = await supabase
    .from('sticky_notes')
    .select('id, sticky_variant')
    .is('sticky_variant', null);

  if (error) {
    console.error('Error fetching notes:', error);
    return;
  }

  if (!notes || notes.length === 0) {
    console.log('All notes already have sticky_variant assigned!');
    return;
  }

  console.log(`Found ${notes.length} notes without sticky_variant. Assigning variants...`);

  for (const note of notes) {
    // Assign a random variant based on note ID for consistency
    const variant = parseInt(note.id.slice(-1)) % 3;

    const { error: updateError } = await supabase
      .from('sticky_notes')
      .update({ sticky_variant: variant })
      .eq('id', note.id);

    if (updateError) {
      console.error(`Error updating note ${note.id}:`, updateError);
    } else {
      console.log(`Updated note ${note.id} with variant ${variant}`);
    }
  }

  console.log('Done! All existing notes now have sticky_variant assigned.');
}

fixExistingVariants();
