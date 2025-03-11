
require('dotenv').config();
const neo4j = require('neo4j-driver');

// Connect to Neo4j
const uri = process.env.VITE_NEO4J_URI;
const user = process.env.VITE_NEO4J_USER;
const password = process.env.VITE_NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error('Missing Neo4j credentials in .env file');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// This script adds custom data to your Neo4j database
async function addCustomData() {
  const session = driver.session();
  
  try {
    // Create a user
    console.log('Creating a custom user...');
    await session.run(`
      MERGE (u:User {
        id: 'user-custom-1'
      })
      ON CREATE SET
        u.name = 'Your Name',
        u.email = 'your-email@example.com',
        u.avatar_url = 'https://example.com/avatar.png'
      RETURN u
    `);
    
    // Create a bookshelf
    console.log('Creating a custom bookshelf...');
    await session.run(`
      MATCH (u:User {id: 'user-custom-1'})
      MERGE (b:Bookshelf {
        id: 'shelf-custom-1'
      })
      ON CREATE SET
        b.name = 'My Favorite Essays',
        b.description = 'A collection of my favorite essays from around the web',
        b.is_public = true,
        b.created_at = datetime()
      MERGE (u)-[:OWNS]->(b)
      RETURN b
    `);
    
    // Add some essays from the Bookshelf page
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
      },
      {
        id: 1632,
        title: "The devotion of the human dad separates us from other apes",
        domain_name: "Aeon",
        author: "Anna Machin",
        url: "https://aeon.co/essays/the-devotion-of-the-human-dad-separates-us-from-other-apes"
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
        MERGE (b)-[:CONTAINS]->(e)
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
