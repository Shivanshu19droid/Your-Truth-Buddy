import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzyhzuvppoizkrruriju.supabase.co'
// You need to replace this with your actual Supabase anon key
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your_supabase_anon_key_here'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('questions').select('count').limit(1);
    if (error) {
      console.warn('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.warn('Supabase connection test failed:', error.message);
    return false;
  }
}

// Database table names
export const TABLES = {
  USERS: 'users',
  QUESTIONS: 'questions', 
  USER_ANSWERS: 'user_answers',
  VERIFICATION_REQUESTS: 'verification_requests'
}
