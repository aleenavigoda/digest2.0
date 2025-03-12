import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables or defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log the first 10 characters of the key for debugging
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key (first 10 chars):", supabaseKey.substring(0, 10) + "...");

// Extract the ref value from the JWT token
const refValue = supabaseUrl.split('https://')[1]?.split('.')[0];
console.log("Ref value in JWT:", refValue);

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client initialized successfully");