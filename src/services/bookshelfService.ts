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