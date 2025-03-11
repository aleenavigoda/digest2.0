
import { createClient } from 'neo4j-driver';

export interface Bookshelf {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
}

// This is a client-side service, so we'll create a function that
// calls an API endpoint instead of directly connecting to Neo4j
export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  try {
    const response = await fetch('/api/bookshelves');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as Bookshelf[];
  } catch (error) {
    console.error('Error fetching bookshelves:', error);
    // Return mock data for now as fallback
    return MOCK_BOOKSHELVES;
  }
}

// Mock data for bookshelves to use as fallback
const MOCK_BOOKSHELVES: Bookshelf[] = [
  {
    id: 'shelf-writing',
    name: 'Writing on Writing',
    description: 'The best essays from the best essayists on improving your craft, finding your audience, and owning your voice.',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png',
    is_public: true,
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'shelf-climate',
    name: 'Climate & Care',
    description: 'How can we re-write ecologies of care through the lens of indigenous heritage and the earth\'s natural primitives?',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png',
    is_public: true,
    created_at: '2023-01-02T00:00:00.000Z'
  },
  {
    id: 'shelf-philosophy',
    name: 'Philosophy Fundamentals',
    description: 'Deep dives into philosophical ideas that shape our understanding of the world.',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png',
    is_public: true,
    created_at: '2023-01-03T00:00:00.000Z'
  },
  {
    id: 'shelf-tech',
    name: 'Technology Trends',
    description: 'Latest developments in technology and how they might shape our future.',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png',
    is_public: true,
    created_at: '2023-01-04T00:00:00.000Z'
  }
];
