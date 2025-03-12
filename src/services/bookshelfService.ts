export interface Bookshelf {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  owner_id: string;
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

export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  // Return mock data
  return new Promise((resolve) => {
    // Simulate a network delay
    setTimeout(() => {
      resolve(mockBookshelves);
    }, 500);
  });
}
import { supabase } from "../lib/supabase";

export interface Bookshelf {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  image_url: string;
}

export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  try {
    console.log("Fetching bookshelves from Supabase...");
    
    // Query the bookshelf_remix table in Supabase
    const { data, error } = await supabase
      .from("bookshelf_remix")
      .select("id, core_curator, shelf_name, shelf_description, image_url");
    
    if (error) {
      console.error("Error fetching bookshelves:", error);
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} bookshelves from Supabase`);
    
    // Map the Supabase data to our Bookshelf interface
    return data.map(item => ({
      id: item.id || `shelf-${Math.random().toString(36).substring(2, 10)}`,
      name: item.shelf_name,
      description: item.shelf_description,
      is_public: true, // Assuming all bookshelves in the table are public
      image_url: item.image_url || 
        // Alternate between two default images based on the first character of the shelf name
        (item.shelf_name.charCodeAt(0) % 2 === 0 
          ? "https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png"
          : "https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png")
    }));
  } catch (error) {
    console.error("Error in getPublicBookshelves:", error);
    return [];
  }
}
