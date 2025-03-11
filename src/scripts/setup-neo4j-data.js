
// Pure JavaScript setup script for Neo4j
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables
const neo4jUri = process.env.VITE_NEO4J_URI || '';
const neo4jUser = process.env.VITE_NEO4J_USER || '';
const neo4jPassword = process.env.VITE_NEO4J_PASSWORD || '';

console.log('Starting Neo4j setup with JavaScript...');
console.log('URI:', neo4jUri ? 'URI is set' : 'URI is missing');

if (!neo4jUri || !neo4jUser || !neo4jPassword) {
  console.error('Missing Neo4j credentials. Please check your .env file.');
  process.exit(1);
}

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// This script creates sample data for the Neo4j graph
async function setupSampleData() {
  const session = driver.session();
  
  try {
    console.log('Setting up sample Neo4j data...');
    
    // Clear existing data for clean setup
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('Cleared existing data');
    
    // Create sample users
    console.log('Creating sample users...');
    await session.run(`
      CREATE (alice:User {
        id: 'user-alice',
        name: 'Alice Smith',
        email: 'alice@example.com',
        avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      })
    `);

    await session.run(`
      CREATE (bob:User {
        id: 'user-bob',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      })
    `);

    // Create friendships
    console.log('Creating friendships...');
    await session.run(`
      MATCH (alice:User {id: 'user-alice'})
      MATCH (bob:User {id: 'user-bob'})
      CREATE (alice)-[:FRIEND]->(bob)
      CREATE (bob)-[:FRIEND]->(alice)
    `);

    // Create bookshelves
    console.log('Creating bookshelves...');
    await session.run(`
      MATCH (alice:User {id: 'user-alice'})
      CREATE (shelf:Bookshelf {
        id: 'shelf-writing',
        name: 'Writing on Writing',
        description: 'The best essays from the best essayists on improving your craft, finding your audience, and owning your voice.',
        is_public: true,
        created_at: datetime(),
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      })
      CREATE (alice)-[:OWNS]->(shelf)
    `);

    await session.run(`
      MATCH (bob:User {id: 'user-bob'})
      CREATE (shelf:Bookshelf {
        id: 'shelf-science',
        name: 'Science Explained',
        description: 'Complex scientific concepts explained in simple terms by top researchers and science communicators.',
        is_public: true,
        created_at: datetime(),
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      })
      CREATE (bob)-[:OWNS]->(shelf)
    `);

    // Create some essays
    console.log('Creating essays...');
    const essays = [
      {
        id: '1',
        title: "Children today are suffering a severe deficit of play",
        domain_name: "Aeon",
        author: "Peter Gray",
        url: "https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play"
      },
      {
        id: '8',
        title: "Elon Musk puts his case for a multi-planet civilisation",
        domain_name: "Aeon",
        author: "Ross Andersen",
        url: "https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation"
      },
      {
        id: '1632',
        title: "The devotion of the human dad separates us from other apes",
        domain_name: "Aeon",
        author: "Anna Machin",
        url: "https://aeon.co/essays/the-devotion-of-the-human-dad-separates-us-from-other-apes"
      }
    ];

    // Add essays to shelves
    for (const essay of essays) {
      console.log(`Adding essay "${essay.title}" to bookshelf...`);
      await session.run(`
        MATCH (shelf:Bookshelf {id: 'shelf-writing'})
        CREATE (e:Essay {
          id: $id,
          title: $title,
          domain_name: $domainName,
          author: $author,
          url: $url
        })
        CREATE (shelf)-[:CONTAINS]->(e)
      `, {
        id: essay.id,
        title: essay.title,
        domainName: essay.domain_name,
        author: essay.author,
        url: essay.url
      });
    }

    console.log('Sample data setup complete!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the setup function
setupSampleData();
