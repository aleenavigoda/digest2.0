import { createSession } from '../lib/neo4j';

// Define the types first
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Essay {
  id: string;
  title: string;
  domain_name: string;
  author: string;
  url: string;
  date_published: string;
}

export interface Bookshelf {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

// User operations
export async function createUser(user: User): Promise<User> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      CREATE (u:User {
        id: $id,
        name: $name,
        email: $email,
        avatar_url: $avatar_url
      })
      RETURN u
      `,
      user
    );

    return result.records[0].get('u').properties as User;
  } finally {
    await session.close();
  }
}

// Create friendship between users
export async function createFriendship(userId1: string, userId2: string): Promise<void> {
  const session = createSession();
  try {
    await session.run(
      `
      MATCH (u1:User {id: $userId1})
      MATCH (u2:User {id: $userId2})
      WHERE u1 <> u2
      CREATE (u1)-[:FRIEND]->(u2)
      CREATE (u2)-[:FRIEND]->(u1)
      `,
      { userId1, userId2 }
    );
  } finally {
    await session.close();
  }
}

// Bookshelf related operations
export async function createBookshelf(bookshelf: Bookshelf): Promise<Bookshelf> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $owner_id})
      CREATE (b:Bookshelf {
        id: $id,
        name: $name,
        description: $description,
        is_public: $is_public,
        created_at: $created_at,
        image_url: $image_url
      })
      CREATE (u)-[:OWNS]->(b)
      RETURN b
      `,
      bookshelf
    );

    return result.records[0].get('b').properties as Bookshelf;
  } finally {
    await session.close();
  }
}

// Get all public bookshelves
export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  try {
    const session = createSession();
    try {
      const result = await session.run(
        `
        MATCH (b:Bookshelf)
        WHERE b.is_public = true
        RETURN b
        `
      );

      return result.records.map(record => {
        const bookshelf = record.get('b').properties;
        // Convert Neo4j types to JavaScript types
        return {
          ...bookshelf,
          is_public: Boolean(bookshelf.is_public),
          created_at: bookshelf.created_at ? bookshelf.created_at.toString() : new Date().toISOString()
        };
      });
    } catch (error) {
      console.error("Error fetching public bookshelves:", error);
      return [];
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Failed to create Neo4j session:', error);
    return [];
  }
}

// Get bookshelves owned by a user
export async function getUserBookshelves(userId: string): Promise<Bookshelf[]> {
  console.log(`Getting bookshelves for user: ${userId}`);

  // Mock bookshelf data
  const mockBookshelves: Bookshelf[] = [
    {
      id: "bookshelf-1",
      name: "Climate & Care",
      description: "Essays on climate change and environmental stewardship",
      image_url: "https://res.cloudinary.com/subframe/image/upload/v1723780559/uploads/302/tkyvdicnwbc5ftuyysc0.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: userId
    },
    {
      id: "bookshelf-2",
      name: "Technology & Society",
      description: "Exploring the impact of technology on modern society",
      image_url: "https://res.cloudinary.com/subframe/image/upload/v1723780683/uploads/302/miu3qrdcodj27aeo9mu9.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: userId
    }
  ];

  return mockBookshelves;
}

// Get bookshelf by ID
export async function getBookshelf(bookshelfId: string): Promise<Bookshelf | null> {
  console.log(`Getting bookshelf with ID: ${bookshelfId}`);

  // Mock bookshelf data
  const mockBookshelf: Bookshelf = {
    id: bookshelfId,
    name: "Climate & Care",
    description: "How can we re-write ecologies of care through the lens of indigenous heritage and the earth's natural primitives?",
    image_url: "https://res.cloudinary.com/subframe/image/upload/v1723780559/uploads/302/tkyvdicnwbc5ftuyysc0.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: "user-123"
  };

  return mockBookshelf;
}


// Essay operations
export async function addEssayToBookshelf(bookshelfId: string, essay: Essay): Promise<void> {
  const session = createSession();
  try {
    await session.run(
      `
      MATCH (b:Bookshelf {id: $bookshelfId})
      MERGE (e:Essay {id: $essay.id})
      ON CREATE SET 
        e.title = $essay.title,
        e.domain_name = $essay.domain_name,
        e.author = $essay.author,
        e.url = $essay.url,
        e.date_published = $essay.date_published,
        e.image_url = $essay.image_url
      MERGE (b)-[:CONTAINS]->(e)
      `,
      { bookshelfId, essay }
    );
  } finally {
    await session.close();
  }
}

// Get essays in a bookshelf
export async function getBookshelfEssays(bookshelfId: string): Promise<Essay[]> {
  console.log(`Fetching essays for bookshelf ID: ${bookshelfId}`);

  try {
    // This would normally fetch data from your Neo4j database
    // For now, we'll return mock data regardless of the bookshelfId
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Mock data with more realistic essay information
    const essays = [
      {
        id: "essay1",
        title: "The Art of Climate Resilience",
        domain_name: "nature.com",
        author: "Jane Smith",
        url: "https://nature.com/art-of-climate-resilience",
        date_published: "2023-01-15"
      },
      {
        id: "essay2",
        title: "Indigenous Knowledge and Environmental Stewardship",
        domain_name: "scientificamerican.com",
        author: "John Doe",
        url: "https://scientificamerican.com/indigenous-knowledge",
        date_published: "2023-02-20"
      },
      {
        id: "essay3",
        title: "Sustainable Design Systems for a Warming World",
        domain_name: "medium.com",
        author: "Alice Johnson",
        url: "https://medium.com/sustainable-design",
        date_published: "2023-03-10"
      },
      {
        id: "essay4",
        title: "Ocean Conservation Methods from Pacific Island Communities",
        domain_name: "oceana.org",
        author: "Bob Miller",
        url: "https://oceana.org/conservation-methods",
        date_published: "2023-04-05"
      },
      {
        id: "essay5",
        title: "The Economics of Renewable Energy in Developing Nations",
        domain_name: "economist.com",
        author: "Sarah Lee",
        url: "https://economist.com/renewable-energy-economics",
        date_published: "2023-05-20"
      },
      {
        id: "essay6",
        title: "Traditional Farming Techniques and Modern Agriculture",
        domain_name: "agriculture.org",
        author: "Michael Chen",
        url: "https://agriculture.org/traditional-farming",
        date_published: "2023-06-12"
      },
      {
        id: "essay7",
        title: "Climate Justice: Equity in Environmental Policy",
        domain_name: "theguardian.com",
        author: "Elena Rodriguez",
        url: "https://theguardian.com/climate-justice",
        date_published: "2023-07-08"
      }
    ];

    console.log(`Returning ${essays.length} essays for bookshelf ID: ${bookshelfId}`);
    return essays;
  } catch (error) {
    console.error("Error in getBookshelfEssays:", error);
    // Return some mock data even on error to ensure UI works
    return [
      {
        id: "fallback1",
        title: "Fallback Article on Climate Change",
        domain_name: "example.com",
        author: "System",
        url: "https://example.com/fallback",
        date_published: "2023-01-01"
      }
    ];
  }
}

// Add a collaborator to a bookshelf
export async function addCollaborator(bookshelfId: string, userId: string): Promise<void> {
  const session = createSession();
  try {
    await session.run(
      `
      MATCH (b:Bookshelf {id: $bookshelfId})
      MATCH (u:User {id: $userId})
      MERGE (u)-[:CAN_EDIT]->(b)
      `,
      { bookshelfId, userId }
    );
  } finally {
    await session.close();
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $id})
      RETURN u
      `,
      { id }
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get('u').properties as User;
  } finally {
    await session.close();
  }
}

// Friend connections
export async function getUserFriends(userId: string): Promise<User[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:FRIEND]->(friend:User)
      RETURN friend
      `,
      { userId }
    );

    return result.records.map(record => record.get('friend').properties as User);
  } finally {
    await session.close();
  }
}

// Recommendation functions
export async function recommendSimilarUsers(userId: string, limit: number = 5): Promise<User[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e:Essay)
      MATCH (other:User)-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e)
      WHERE u.id <> other.id
      AND NOT (u)-[:FRIEND]-(other)
      RETURN other, count(e) as commonEssays
      ORDER BY commonEssays DESC
      LIMIT $limit
      `,
      { userId, limit }
    );

    return result.records.map(record => record.get('other').properties as User);
  } finally {
    await session.close();
  }
}

// Create a new bookshelf
export async function createBookshelf(
  userId: string, 
  name: string, 
  description: string
): Promise<Bookshelf> {
  console.log(`Creating bookshelf for user: ${userId}`);

  // Mock new bookshelf
  const newBookshelf: Bookshelf = {
    id: `bookshelf-${Date.now()}`,
    name,
    description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: userId
  };

  return newBookshelf;
}