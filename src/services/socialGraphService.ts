// Updated service without Neo4j dependencies
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Bookshelf {
  id: string;
  name: string;
  description: string;
  is_public?: boolean;
  created_at: string;
  updated_at?: string;
  owner_id: string;
  image_url?: string;
  core_curator?: string;
}

export interface Essay {
  id: string;
  title: string;
  url: string;
  author: string;
  date_published: string;
  domain_name: string;
}

// Mock data for development purposes
const MOCK_USERS: User[] = [
  {
    id: 'user-alice',
    name: 'Alice Smith',
    email: 'alice@example.com',
    avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
  },
  {
    id: 'user-bob',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
  }
];

const MOCK_BOOKSHELVES: Bookshelf[] = [
  {
    id: 'shelf-writing',
    name: 'Writing on Writing',
    description: 'The best essays from the best essayists on improving your craft, finding your audience, and owning your voice.',
    is_public: true,
    owner_id: 'user-alice',
    created_at: '2023-01-01T00:00:00.000Z',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
  },
  {
    id: 'shelf-tech',
    name: 'Technology Futures',
    description: 'Forward-looking essays on AI, computing, and the future of technology.',
    is_public: true,
    owner_id: 'user-bob',
    created_at: '2023-01-02T00:00:00.000Z',
    core_curator: 'DIGEST'
  }
];

const MOCK_ESSAYS: Essay[] = [
  {
    id: 'essay-1',
    title: 'The Art of Writing',
    url: 'https://example.com/essays/art-of-writing',
    author: 'Alice Smith',
    date_published: '2023-01-10',
    domain_name: 'example.com'
  },
  {
    id: 'essay-2',
    title: 'Future of AI',
    url: 'https://techblog.com/future-ai',
    author: 'Bob Johnson',
    date_published: '2023-01-15',
    domain_name: 'techblog.com'
  }
];

// User operations
export async function getUser(userId: string): Promise<User | null> {
  console.log(`Fetching user: ${userId}`);
  return MOCK_USERS.find(user => user.id === userId) || null;
}

export async function createUser(user: User): Promise<User> {
  console.log(`Creating user: ${user.name}`);
  return user; // Mock implementation
}

// Friendship operations
export async function createFriendship(userId1: string, userId2: string): Promise<boolean> {
  console.log(`Creating friendship between ${userId1} and ${userId2}`);
  return true; // Mock implementation
}

export async function getUserFriends(userId: string): Promise<User[]> {
  console.log(`Fetching friends for user: ${userId}`);
  // Mock implementation - return all users except the one requested
  return MOCK_USERS.filter(user => user.id !== userId);
}

// Bookshelf operations
export async function getBookshelf(bookshelfId: string): Promise<Bookshelf | null> {
  console.log(`Fetching bookshelf: ${bookshelfId}`);
  return MOCK_BOOKSHELVES.find(shelf => shelf.id === bookshelfId) || null;
}

export async function getUserBookshelves(userId: string): Promise<Bookshelf[]> {
  console.log(`Fetching bookshelves for user: ${userId}`);
  return MOCK_BOOKSHELVES.filter(shelf => shelf.owner_id === userId);
}

export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  console.log('Fetching public bookshelves');
  return MOCK_BOOKSHELVES.filter(shelf => shelf.is_public);
}

export async function createBookshelf(bookshelfOrUserId: Bookshelf | string, name?: string, description?: string): Promise<Bookshelf> {
  if (typeof bookshelfOrUserId === 'string') {
    // This is the userId, name, description signature
    const userId = bookshelfOrUserId;
    console.log(`Creating bookshelf for user: ${userId}`);

    // Create a new bookshelf object
    const newBookshelf: Bookshelf = {
      id: `bookshelf-${Date.now()}`,
      name: name || '',
      description: description || '',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: userId
    };

    return newBookshelf;
  } else {
    // This is the bookshelf object signature
    console.log(`Creating bookshelf: ${bookshelfOrUserId.name}`);
    return bookshelfOrUserId;
  }
}

// Collaborative bookshelf operations
export async function addCollaborator(bookshelfId: string, userId: string): Promise<boolean> {
  console.log(`Adding user ${userId} as collaborator to bookshelf ${bookshelfId}`);
  return true; // Mock implementation
}

export async function getBookshelfCollaborators(bookshelfId: string): Promise<User[]> {
  console.log(`Fetching collaborators for bookshelf: ${bookshelfId}`);
  // Mock implementation - return a subset of users
  return MOCK_USERS.slice(0, 1);
}

// Essay operations
export async function getBookshelfEssays(bookshelfId: string): Promise<Essay[]> {
  console.log(`Fetching essays for bookshelf: ${bookshelfId}`);
  // Mock implementation - return all essays
  return MOCK_ESSAYS;
}

export async function addEssayToBookshelf(bookshelfId: string, essay: Essay): Promise<boolean> {
  console.log(`Adding essay ${essay.title} to bookshelf ${bookshelfId}`);
  return true; // Mock implementation
}

export async function removeEssayFromBookshelf(bookshelfId: string, essayId: string): Promise<boolean> {
  console.log(`Removing essay ${essayId} from bookshelf ${bookshelfId}`);
  return true; // Mock implementation
}