
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
    title: 'Children today are suffering a severe deficit of play',
    domain_name: 'Aeon',
    author: 'Peter Gray',
    url: 'https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play',
    date_published: '2021-05-15',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
  },
  {
    id: '2',
    title: 'Elon Musk puts his case for a multi-planet civilisation',
    domain_name: 'Aeon',
    author: 'Ross Andersen',
    url: 'https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation',
    date_published: '2021-06-22',
    image_url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'The devotion of the human dad separates us from other apes',
    domain_name: 'Aeon',
    author: 'Anna Machin',
    url: 'https://aeon.co/essays/the-devotion-of-the-human-dad-separates-us-from-other-apes',
    date_published: '2021-07-10',
    image_url: 'https://images.unsplash.com/photo-1501155715159-ad2931d01578?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'How to write clearly and concisely',
    domain_name: 'Medium',
    author: 'James Clear',
    url: 'https://medium.com/swlh/how-to-write-clearly-and-concisely-67dbba587cf8',
    date_published: '2022-01-15',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'The future of artificial intelligence',
    domain_name: 'The Atlantic',
    author: 'Sarah Johnson',
    url: 'https://www.theatlantic.com/technology/archive/2023/03/ai-chatgpt-future-artificial-intelligence/673335/',
    date_published: '2022-03-22',
    image_url: 'https://images.unsplash.com/photo-1677442135968-6adaba1d850c?q=80&w=2832&auto=format&fit=crop'
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
    
    console.log('Successfully loaded essays:', essays.length);
    return essays;
  } catch (error) {
    console.error('Error in getAllEssays:', error);
    return MOCK_ESSAYS; // Return mock data on exception
  }
}
