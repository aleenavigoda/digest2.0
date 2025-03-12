export interface Bookshelf {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  owner_id: string;
  created_at: string;
  image_url?: string;
  core_curator?: string;
}

// Updated for Supabase bookshelf_remix table
export interface BookshelfRemix {
  id: string;
  shelf_name: string;
  shelf_description: string;
  core_curator: string;
  created_at: string;
  image_url?: string;
}

// Mock data for bookshelves based on your Neo4j test data
const mockBookshelves: Bookshelf[] = [
  {
    id: 'shelf-alice-1',
    name: 'Writing on Writing',
    description: 'Essays about the art and craft of writing',
    is_public: true,
    owner_id: 'user-alice',
    created_at: new Date().toISOString(),
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
  },
  {
    id: 'shelf-alice-2',
    name: 'Philosophy',
    description: 'Deep philosophical essays',
    is_public: true,
    owner_id: 'user-alice',
    created_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: 'shelf-bob-1',
    name: 'Tech Essays',
    description: 'Essays about technology and its impact',
    is_public: true,
    owner_id: 'user-bob',
    created_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop'
  }
];

// Import the Supabase client
import { supabase } from '../lib/supabase';

export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  try {
    console.log("Fetching bookshelves from Supabase bookshelf_remix table...");
    
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('bookshelf_remix')
      .select('*');
    
    if (error) {
      console.error("Error fetching bookshelves from Supabase:", error);
      // Fall back to mock data
      return mockBookshelves;
    }
    
    if (data && data.length > 0) {
      console.log(`Successfully fetched ${data.length} bookshelves from Supabase`);
      
      // Transform the data to match the Bookshelf interface
      return data.map((shelf: BookshelfRemix) => ({
        id: shelf.id || `shelf-${Math.random().toString(36).substring(2, 9)}`,
        name: shelf.shelf_name,
        description: shelf.shelf_description,
        is_public: true, // Assuming all are public
        owner_id: shelf.core_curator || 'system',
        created_at: shelf.created_at || new Date().toISOString(),
        image_url: shelf.image_url || 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png',
        core_curator: shelf.core_curator
      }));
    }
    
    // If no data, fall back to mock data
    console.log("No bookshelves found in Supabase, using mock data");
    return mockBookshelves;
  } catch (error) {
    console.error("Error fetching bookshelves:", error);
    return mockBookshelves;
  }
}