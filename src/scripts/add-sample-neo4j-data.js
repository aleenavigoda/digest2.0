
const neo4j = require('neo4j-driver');
require('dotenv').config();

// Get Neo4j connection details from environment variables
const neo4jUri = process.env.VITE_NEO4J_URI;
const neo4jUser = process.env.VITE_NEO4J_USER;
const neo4jPassword = process.env.VITE_NEO4J_PASSWORD;

console.log('Loading sample data into Neo4j...');

if (!neo4jUri || !neo4jUser || !neo4jPassword) {
  console.error('Error: Missing Neo4j credentials in .env file');
  process.exit(1);
}

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri, 
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Sample data for bookshelves
const sampleBookshelves = [
  {
    id: "shelf-1",
    name: "Philosophy",
    description: "Explore ideas about knowledge, reality, and existence",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=200"
  },
  {
    id: "shelf-2",
    name: "Technology",
    description: "Latest thoughts on software, AI, and innovation",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200"
  },
  {
    id: "shelf-3",
    name: "Science",
    description: "Essays on physics, biology, and the scientific method",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=200"
  },
  {
    id: "shelf-4",
    name: "Literature",
    description: "Reflections on fiction, poetry, and literary criticism",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&w=200"
  },
  {
    id: "shelf-5",
    name: "History",
    description: "Understanding the past through scholarly analysis",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=200"
  }
];

async function loadSampleData() {
  const session = driver.session();
  
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');
    
    // Add bookshelves
    console.log('Adding sample bookshelves...');
    for (const shelf of sampleBookshelves) {
      await session.run(
        `
        CREATE (b:Bookshelf {
          id: $id,
          name: $name,
          description: $description,
          is_public: $is_public,
          image_url: $image_url
        })
        `,
        shelf
      );
    }
    
    // Add a sample user
    console.log('Adding sample user...');
    await session.run(
      `
      CREATE (u:User {
        id: "user-1",
        name: "Sample User",
        email: "user@example.com"
      })
      `
    );
    
    // Create some relationships
    console.log('Creating relationships...');
    await session.run(
      `
      MATCH (u:User {id: "user-1"})
      MATCH (b:Bookshelf)
      WHERE b.id IN ["shelf-1", "shelf-3"]
      CREATE (u)-[:CREATED]->(b)
      `
    );
    
    console.log('✅ Sample data loaded successfully');
    
  } catch (error) {
    console.error('Error loading sample data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

loadSampleData()
  .catch(error => console.error('Unhandled error:', error));
