
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Get environment variables
const neo4jUri = process.env.NEO4J_URI || '';
const neo4jUser = process.env.NEO4J_USERNAME || '';
const neo4jPassword = process.env.NEO4J_PASSWORD || '';

console.log('Setting up Neo4j database with sample data...');
console.log('URI:', neo4jUri ? 'URI is set' : 'URI is missing');
console.log('User:', neo4jUser ? 'User is set' : 'User is missing');
console.log('Password:', neo4jPassword ? 'Password is set' : 'Password is missing');

if (!neo4jUri || !neo4jUser || !neo4jPassword) {
  console.error('Missing Neo4j credentials. Please check your .env file.');
  process.exit(1);
}

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

async function setupDatabase() {
  const session = driver.session();
  
  try {
    console.log('Connected to Neo4j database');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');
    
    // Create some bookshelves
    console.log('Creating sample bookshelves...');
    const bookshelves = [
      {
        id: uuidv4(),
        name: 'Technology Trends',
        description: 'Latest insights on emerging technologies and digital innovation.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      },
      {
        id: uuidv4(),
        name: 'Product Design',
        description: 'Essays about product design methodologies and best practices.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      },
      {
        id: uuidv4(),
        name: 'Startup Strategy',
        description: 'Insights on building successful startups and business growth.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      },
      {
        id: uuidv4(),
        name: 'AI Research',
        description: 'Deep dives into artificial intelligence research and applications.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      },
      {
        id: uuidv4(),
        name: 'Digital Marketing',
        description: 'Effective strategies for digital marketing and audience growth.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      }
    ];
    
    for (const shelf of bookshelves) {
      await session.run(`
        CREATE (b:Bookshelf {
          id: $id,
          name: $name,
          description: $description,
          is_public: $is_public,
          image_url: $image_url,
          created_at: datetime()
        })
      `, shelf);
    }
    
    // Create some users
    console.log('Creating sample users...');
    const users = [
      {
        id: uuidv4(),
        name: 'Alice Johnson',
        email: 'alice@example.com'
      },
      {
        id: uuidv4(),
        name: 'Bob Smith',
        email: 'bob@example.com'
      }
    ];
    
    for (const user of users) {
      await session.run(`
        CREATE (u:User {
          id: $id,
          name: $name,
          email: $email,
          created_at: datetime()
        })
      `, user);
    }
    
    // Create relationships
    console.log('Creating relationships...');
    await session.run(`
      MATCH (u:User), (b:Bookshelf)
      WHERE u.name = 'Alice Johnson' AND b.name = 'Technology Trends'
      CREATE (u)-[:CREATED]->(b)
    `);
    
    await session.run(`
      MATCH (u:User), (b:Bookshelf)
      WHERE u.name = 'Bob Smith' AND b.name = 'Product Design'
      CREATE (u)-[:CREATED]->(b)
    `);
    
    console.log('Sample data setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

setupDatabase()
  .catch(error => console.error('Unhandled error:', error));
