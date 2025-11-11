import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bysjndembewhgpbemijc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c2puZGVtYmV3aGdwYmVtaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE2NTcsImV4cCI6MjA3Nzc1NzY1N30.7LUvcuZFQ4yExRGwSipVYZZTNI9shrRxlBO-tzRyXiM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkNotes() {
  const result = await supabase.from('sticky_notes').select('*');
  console.log('Current sticky notes count:', result.data ? result.data.length : 0);
  if (result.data && result.data.length > 0) {
    console.log('First note:', result.data[0]);
  }
}

checkNotes();
