
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Key available:', !!supabaseKey);

// Create Supabase client with proper error handling
let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true
      }
    });
    console.log('Supabase client initialized successfully');
  } else {
    console.error('Missing Supabase credentials in environment variables');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

export { supabase };
