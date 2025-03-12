
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 10 chars):', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'not available');
console.log('Ref value in JWT:', supabaseKey ? 
  JSON.parse(atob(supabaseKey.split('.')[1])).ref : 'could not extract');

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
    
    // Test the connection
    supabase.from('articles').select('count', { count: 'exact', head: true })
      .then(response => {
        if (response.error) {
          console.error('Test query failed:', response.error);
        } else {
          console.log('Supabase connection verified successfully');
        }
      })
      .catch(err => console.error('Error testing Supabase connection:', err));
  } else {
    console.error('Missing Supabase credentials in environment variables');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

export { supabase };
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables or defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// Log the first 10 characters of the key for debugging
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key (first 10 chars):", supabaseKey.substring(0, 10) + "...");

// Extract the ref value from the JWT token
const refValue = supabaseUrl.split('https://')[1]?.split('.')[0];
console.log("Ref value in JWT:", refValue);

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client initialized successfully");
