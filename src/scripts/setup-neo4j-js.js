
// Simple JavaScript Neo4j setup script
const neo4j = require('neo4j-driver');
require('dotenv').config();

// Check all possible environment variable naming conventions
const neo4jUri = process.env.NEO4J_URI || 
                process.env.VITE_NEO4J_URI || 
                process.env.NEO4J_URL || 
                process.env.VITE_NEO4J_URL || 
                'bolt://localhost:7687';

const neo4jUser = process.env.NEO4J_USER || 
                 process.env.VITE_NEO4J_USER || 
                 process.env.NEO4J_USERNAME || 
                 process.env.VITE_NEO4J_USERNAME || 
                 'neo4j';

const neo4jPassword = process.env.NEO4J_PASSWORD || 
                     process.env.VITE_NEO4J_PASSWORD || 
                     'password';

console.log('Neo4j Connection Info:');
console.log('URI:', neo4jUri);
console.log('User:', neo4jUser);
console.log('Password:', neo4jPassword ? '(password set)' : '(no password)');

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
    await session.run(`
      CREATE (b1:Bookshelf {
        id: 'shelf-1',
        name: 'Technology Trends',
        description: 'Latest insights on emerging technologies and digital innovation.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      })
    `);
    
    await session.run(`
      CREATE (b2:Bookshelf {
        id: 'shelf-2',
        name: 'Product Design',
        description: 'Essays about product design methodologies and best practices.',
        is_public: true,
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
      })
    `);
    
    // Create some users
    console.log('Creating sample users...');
    await session.run(`
      CREATE (u1:User {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@example.com'
      })
    `);
    
    await session.run(`
      CREATE (u2:User {
        id: 'user-2',
        name: 'Bob Smith',
        email: 'bob@example.com'
      })
    `);
    
    // Create relationships
    console.log('Creating relationships...');
    await session.run(`
      MATCH (u:User {id: 'user-1'}), (b:Bookshelf {id: 'shelf-1'})
      CREATE (u)-[:CREATED]->(b)
    `);
    
    await session.run(`
      MATCH (u:User {id: 'user-2'}), (b:Bookshelf {id: 'shelf-2'})
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
