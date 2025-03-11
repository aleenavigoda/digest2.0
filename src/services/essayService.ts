
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Essay {
  id: string;
  title: string;
  domain_name: string;
  author: string;
  url: string;
  date_published: string;
  image_url?: string;
}

export async function getAllEssays(): Promise<Essay[]> {
  try {
    const { data, error } = await supabase
      .from('all_urls')
      .select('*')
      .order('date_published', { ascending: false });
    
    if (error) {
      console.error('Error fetching essays:', error);
      throw error;
    }
    
    return data as Essay[];
  } catch (error) {
    console.error('Error in getAllEssays:', error);
    throw error;
  }
}
