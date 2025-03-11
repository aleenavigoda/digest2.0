
import { supabase } from '../lib/supabase';

export interface Essay {
  id: string;
  title: string;
  domain_name: string;
  author: string;
  url: string;
  date_published: string;
  image_url?: string;
}

// Mock data for essays to use as fallback
const MOCK_ESSAYS: Essay[] = [
  {
    id: '1',
    title: "Children today are suffering a severe deficit of play",
    domain_name: "Aeon",
    author: "Peter Gray",
    url: "https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play",
    date_published: "2021-05-15",
    image_url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: '8',
    title: "Elon Musk puts his case for a multi-planet civilisation",
    domain_name: "Aeon",
    author: "Ross Andersen",
    url: "https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation",
    date_published: "2021-06-22",
    image_url: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: '1632',
    title: "The devotion of the human dad separates us from other apes",
    domain_name: "Aeon",
    author: "Anna Machin",
    url: "https://aeon.co/essays/the-devotion-of-the-human-dad-separates-us-from-other-apes",
    date_published: "2021-07-10",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: '42',
    title: "How to write clearly and concisely",
    domain_name: "Medium",
    author: "James Clear",
    url: "https://medium.com/example/how-to-write-clearly",
    date_published: "2022-01-15",
    image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
  },
  {
    id: '57',
    title: "The future of artificial intelligence",
    domain_name: "The Atlantic",
    author: "Sarah Johnson",
    url: "https://www.theatlantic.com/example/ai-future",
    date_published: "2022-03-22",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2940&auto=format&fit=crop"
  }
];

export async function getAllEssays(): Promise<Essay[]> {
  try {
    // Check if supabase client is properly initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      return MOCK_ESSAYS;
    }

    const { data, error } = await supabase
      .from('all_urls')
      .select('*')
      .order('date_published', { ascending: false });
    
    if (error) {
      console.error('Error fetching essays:', error);
      return MOCK_ESSAYS; // Return mock data on error
    }
    
    if (!data || data.length === 0) {
      console.warn('No data returned from Supabase');
      return MOCK_ESSAYS;
    }

    // Map the data from all_urls table to Essay interface
    const essays: Essay[] = data.map(item => ({
      id: item.id?.toString() || Math.random().toString(),
      title: item.title || 'Untitled',
      domain_name: item.domain_name || 'Unknown Source',
      author: item.author || 'Unknown Author',
      url: item.url || '#',
      date_published: item.date_published || new Date().toISOString().substring(0, 10),
      image_url: item.image_url || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2890&auto=format&fit=crop"
    }));
    
    return essays;
  } catch (error) {
    console.error('Error in getAllEssays:', error);
    return MOCK_ESSAYS; // Return mock data on exception
  }
}
