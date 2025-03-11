
import { createClient } from '@supabase/supabase-js';

// Hard-code Supabase credentials to ensure they're available
const supabaseUrl = 'https://rucawrtxdiwhtxjehpvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Y2F3cnR4ZGl3aHR4amVocHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU5NjU0ODQsImV4cCI6MTk5MTU0MTQ4NH0.EYoxHXPjZN7CkL3lJQuV7c7I-sXbD8CcDUEo2gEh1tY';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
