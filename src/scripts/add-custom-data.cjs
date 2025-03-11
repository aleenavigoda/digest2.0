
// CommonJS version of the script that can run with node
const neo4j = require('neo4j-driver');

// Get environment variables
const neo4jUri = process.env.VITE_NEO4J_URI || '';
const neo4jUser = process.env.VITE_NEO4J_USER || '';
const neo4jPassword = process.env.VITE_NEO4J_PASSWORD || '';

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// This script adds custom data to your Neo4j database
async function addCustomData() {
  const session = driver.session();
  
  try {
    // Create a user
    console.log('Creating a custom user...');
    await session.run(`
      CREATE (u:User {
        id: 'user-custom-1',
        name: 'Your Name',
        email: 'your-email@example.com',
        avatar_url: 'https://example.com/avatar.png'
      })
      RETURN u
    `);
    
    // Create a bookshelf
    console.log('Creating a custom bookshelf...');
    await session.run(`
      MATCH (u:User {id: 'user-custom-1'})
      CREATE (b:Bookshelf {
        id: 'shelf-custom-1',
        name: 'My Favorite Essays',
        description: 'A collection of my favorite essays from around the web',
        is_public: true,
        created_at: datetime()
      })
      CREATE (u)-[:OWNS]->(b)
      RETURN b
    `);
    
    // Add some essays
    const essays = [
      {
        id: 1,
        title: "Children today are suffering a severe deficit of play",
        domain_name: "Aeon",
        author: "Peter Gray",
        url: "https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play",
        date_published: "2013-09-18"
      },
      {
        id: 8,
        title: "Elon Musk puts his case for a multi-planet civilisation",
        domain_name: "Aeon",
        author: "Ross Andersen",
        url: "https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation"
      }
    ];
    
    // Add each essay to bookshelf
    for (const essay of essays) {
      console.log(`Adding essay "${essay.title}" to bookshelf...`);
      await session.run(`
        MATCH (b:Bookshelf {id: 'shelf-custom-1'})
        MERGE (e:Essay {id: $id})
        ON CREATE SET 
          e.title = $title,
          e.domain_name = $domainName,
          e.author = $author,
          e.url = $url,
          e.date_published = $datePublished
        CREATE (b)-[:CONTAINS]->(e)
        RETURN e
      `, {
        id: essay.id.toString(),
        title: essay.title,
        domainName: essay.domain_name,
        author: essay.author,
        url: essay.url,
        datePublished: essay.date_published || null
      });
    }
    
    // Create a friendship
    console.log('Adding a friend relationship...');
    await session.run(`
      MATCH (u:User {id: 'user-custom-1'})
      MERGE (friend:User {id: 'user-friend-1'})
      ON CREATE SET 
        friend.name = 'Friend Name',
        friend.email = 'friend@example.com'
      CREATE (u)-[:FRIENDS_WITH]->(friend)
      RETURN friend
    `);
    
    console.log('Custom data setup complete!');
  } catch (error) {
    console.error('Error adding custom data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the script
addCustomData();
