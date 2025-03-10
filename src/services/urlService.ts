
import { supabase } from "@/lib/supabase";

export interface Url {
  id: string;
  domain_name: string;
  author: string;
  date_published: string;
  url: string;
}

export const urlService = {
  async getUrls(): Promise<Url[]> {
    const { data, error } = await supabase
      .from('all_urls')
      .select('*');
    
    if (error) {
      console.error('Error fetching URLs:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getUrlById(id: string): Promise<Url | null> {
    const { data, error } = await supabase
      .from('all_urls')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching URL by ID:', error);
      throw error;
    }
    
    return data;
  }
};
