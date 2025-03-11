
import { createSession } from '../lib/neo4j';

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
  is_public: boolean;
  owner_id?: string;
  created_at: string;
  image_url?: string;
}

// Get all public bookshelves
export async function getPublicBookshelves(): Promise<Bookshelf[]> {
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
}

export interface Essay {
  id: number;
  title: string;
  domain_name: string;
  author: string;
  url: string;
  date_published?: string;
  image_url?: string;
}

// User related operations
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
        created_at: $created_at
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

export async function getUserBookshelves(userId: string): Promise<Bookshelf[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:OWNS]->(b:Bookshelf)
      RETURN b
      ORDER BY b.created_at DESC
      `,
      { userId }
    );
    
    return result.records.map(record => record.get('b').properties as Bookshelf);
  } finally {
    await session.close();
  }
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
      CREATE (b)-[:CONTAINS]->(e)
      `,
      { bookshelfId, essay }
    );
  } finally {
    await session.close();
  }
}

export async function getBookshelfEssays(bookshelfId: string): Promise<Essay[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (b:Bookshelf {id: $bookshelfId})-[:CONTAINS]->(e:Essay)
      RETURN e
      `,
      { bookshelfId }
    );
    
    return result.records.map(record => record.get('e').properties as Essay);
  } finally {
    await session.close();
  }
}

// Friend connections
export async function createFriendship(userId1: string, userId2: string): Promise<void> {
  const session = createSession();
  try {
    await session.run(
      `
      MATCH (u1:User {id: $userId1})
      MATCH (u2:User {id: $userId2})
      WHERE u1.id <> u2.id
      MERGE (u1)-[:FRIEND]-(u2)
      `,
      { userId1, userId2 }
    );
  } finally {
    await session.close();
  }
}

export async function getUserFriends(userId: string): Promise<User[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:FRIEND]-(friend:User)
      RETURN friend
      `,
      { userId }
    );
    
    return result.records.map(record => record.get('friend').properties as User);
  } finally {
    await session.close();
  }
}

// Collaborative bookshelves
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

export async function getCollaborativeBookshelves(userId: string): Promise<Bookshelf[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CAN_EDIT]->(b:Bookshelf)
      WHERE NOT (u)-[:OWNS]->(b)
      RETURN b
      `,
      { userId }
    );
    
    return result.records.map(record => record.get('b').properties as Bookshelf);
  } finally {
    await session.close();
  }
}

// Recommendation functions
export async function recommendEssaysFromFriends(userId: string, limit: number = 10): Promise<Essay[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:FRIEND]-(friend:User)
      MATCH (friend)-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e:Essay)
      WHERE NOT ((u)-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e))
      RETURN e, count(friend) as friendCount
      ORDER BY friendCount DESC
      LIMIT $limit
      `,
      { userId, limit }
    );
    
    return result.records.map(record => record.get('e').properties as Essay);
  } finally {
    await session.close();
  }
}

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
import driver, { createSession } from '../lib/neo4j';

// Type definitions
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
  is_public: boolean;
  owner_id?: string;
  created_at: string;
  image_url?: string;
}

export interface Essay {
  id: number;
  title: string;
  domain_name: string;
  author: string;
  url: string;
  date_published?: string;
  image_url?: string;
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

export async function getPublicBookshelves(): Promise<Bookshelf[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (b:Bookshelf)
      WHERE b.is_public = true
      RETURN b
      ORDER BY b.created_at DESC
      LIMIT 5
      `
    );
    
    return result.records.map(record => record.get('b').properties as Bookshelf);
  } finally {
    await session.close();
  }
}

export async function getUserBookshelves(userId: string): Promise<Bookshelf[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:OWNS]->(b:Bookshelf)
      RETURN b
      ORDER BY b.created_at DESC
      `,
      { userId }
    );
    
    return result.records.map(record => record.get('b').properties as Bookshelf);
  } finally {
    await session.close();
  }
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
      CREATE (b)-[:CONTAINS]->(e)
      `,
      { bookshelfId, essay }
    );
  } finally {
    await session.close();
  }
}

export async function getBookshelfEssays(bookshelfId: string): Promise<Essay[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (b:Bookshelf {id: $bookshelfId})-[:CONTAINS]->(e:Essay)
      RETURN e
      `,
      { bookshelfId }
    );
    
    return result.records.map(record => record.get('e').properties as Essay);
  } finally {
    await session.close();
  }
}

// Friend connections
export async function createFriendship(userId1: string, userId2: string): Promise<void> {
  const session = createSession();
  try {
    await session.run(
      `
      MATCH (u1:User {id: $userId1})
      MATCH (u2:User {id: $userId2})
      WHERE u1.id <> u2.id
      MERGE (u1)-[:FRIEND]-(u2)
      `,
      { userId1, userId2 }
    );
  } finally {
    await session.close();
  }
}

export async function getUserFriends(userId: string): Promise<User[]> {
  const session = createSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:FRIEND]-(friend:User)
      RETURN friend
      `,
      { userId }
    );
    
    return result.records.map(record => record.get('friend').properties as User);
  } finally {
    await session.close();
  }
}

// Collaborative bookshelves
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
