import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function archiveAllTest2() {
  console.log('Archiving all "test 2" notes...');
  
  const { error } = await supabase
    .from('sticky_notes')
    .update({ archived: true })
    .eq('text', 'test 2');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Successfully archived all "test 2" notes!');
  }
}

archiveAllTest2();
