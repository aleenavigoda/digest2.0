
import { createClient } from '@supabase/supabase-js';

// Use real Supabase credentials with fallbacks from any existing .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://szzzyckczpmgvcljzdjj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6enp5Y2tjenBtZ3ZjbGp6ZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzA0MzcsImV4cCI6MjAyODg0NjQzN30.0pGaRqhlQYVk1eYhQ9lxDi4QrqMfObGkchPTPb3vV9M';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
