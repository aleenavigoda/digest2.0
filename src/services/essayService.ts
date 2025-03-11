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
export const MOCK_ESSAYS: Essay[] = [
  {
    id: '1',
    title: 'Children today are suffering a severe deficit of play',
    domain_name: 'Aeon',
    author: 'Peter Gray',
    url: 'https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play',
    date_published: '2021-05-15',
    image_url: 'https://placehold.co/100x100?text=Play'
  },
  {
    id: '2',
    title: 'Elon Musk puts his case for a multi-planet civilisation',
    domain_name: 'Aeon',
    author: 'Ross Andersen',
    url: 'https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation',
    date_published: '2021-06-22',
    image_url: 'https://placehold.co/100x100?text=Mars'
  },
  {
    id: '3',
    title: 'The devotion of the human dad separates us from other apes',
    domain_name: 'Aeon',
    author: 'Anna Machin',
    url: 'https://aeon.co/essays/the-devotion-of-the-human-dad-separates-us-from-other-apes',
    date_published: '2021-07-10',
    image_url: 'https://placehold.co/100x100?text=Apes'
  },
  {
    id: '4',
    title: 'How to write clearly and concisely',
    domain_name: 'Medium',
    author: 'James Clear',
    url: 'https://medium.com/example/how-to-write-clearly',
    date_published: '2022-01-15',
    image_url: 'https://placehold.co/100x100?text=Writing'
  },
  {
    id: '5',
    title: 'The future of artificial intelligence',
    domain_name: 'The Atlantic',
    author: 'Sarah Johnson',
    url: 'https://theatlantic.com/example/ai-future',
    date_published: '2022-03-22',
    image_url: 'https://placehold.co/100x100?text=AI'
  }
];

export async function getAllEssays(): Promise<Essay[]> {
  try {
    // Check if supabase client is properly initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      console.log('Using mock essays data as fallback');
      return MOCK_ESSAYS;
    }

    console.log('Attempting to fetch essays from Supabase...');

    // Try to fetch real data with error handling
    const { data, error } = await supabase
      .from('all_urls')
      .select('*')
      .limit(20); // Limit to 20 rows for faster response

    if (error) {
      console.error('Error fetching essays:', error);
      return MOCK_ESSAYS; // Return mock data on error
    }

    if (!data || data.length === 0) {
      console.warn('No data returned from Supabase');
      return MOCK_ESSAYS;
    }

    // Map the Supabase data to our Essay interface
    const essays: Essay[] = data.map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(36).substring(2, 9),
      title: item.title || 'Untitled',
      domain_name: item.domain_name || 'Unknown',
      author: item.author || 'Anonymous',
      url: item.url || '#',
      date_published: item.date_published || new Date().toISOString().split('T')[0],
      image_url: item.image_url || `https://placehold.co/100x100?text=${encodeURIComponent((item.title?.charAt(0) || 'E').toUpperCase())}`
    }));

    console.log('Successfully loaded essays from Supabase:', essays.length);

    // Return real data
    return essays;
  } catch (error) {
    console.error('Unexpected error in getAllEssays:', error);
    return MOCK_ESSAYS;
  }
}