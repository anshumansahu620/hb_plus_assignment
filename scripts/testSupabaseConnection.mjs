import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read from .env if present
let SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
if (!SECRET_KEY && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/SUPABASE_SECRET_KEY=(.+)/);
  if (match) SECRET_KEY = match[1].trim();
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://uwklwnsrgbzkhpqcbqqj.supabase.co';

const supabaseAdmin = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function testConnection() {
  console.log('Testing connection to Supabase project:', SUPABASE_URL);
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.log('Supabase API responded with notice:', error.message);
    } else {
      console.log('✅ Supabase Admin connection successful!');
      console.log(`Current registered users count: ${data.users.length}`);
    }
  } catch (err) {
    console.error('Connection test error:', err.message);
  }
}

testConnection();
