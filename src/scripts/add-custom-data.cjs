
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
// This script is used to add custom data to Neo4j
require('dotenv').config();
const neo4j = require('neo4j-driver');

// Get Neo4j credentials from environment variables
const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USERNAME;
const neo4jPassword = process.env.NEO4J_PASSWORD;

console.log('Connecting to Neo4j database...');

if (!neo4jUri || !neo4jUser || !neo4jPassword) {
  console.error('Missing Neo4j credentials. Please check your .env file.');
  process.exit(1);
}

const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// This script adds custom data to your Neo4j database
async function addCustomData() {
  const session = driver.session();
  
  try {
    // Create users
    console.log('Creating users...');
    await session.run(`
      MERGE (u1:User {
        id: 'user-alice',
        name: 'Alice Smith',
        email: 'alice@example.com',
        avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      })
      MERGE (u2:User {
        id: 'user-bob',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      })
      RETURN u1, u2
    `);
    
    // Create bookshelves
    console.log('Creating bookshelves...');
    await session.run(`
      MATCH (u1:User {id: 'user-alice'})
      MATCH (u2:User {id: 'user-bob'})
      
      MERGE (b1:Bookshelf {
        id: 'shelf-writing',
        name: 'Writing on Writing',
        description: 'The best essays from the best essayists on improving your craft, finding your audience, and owning your voice.',
        is_public: true,
        created_at: datetime(),
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      })
      
      MERGE (b2:Bookshelf {
        id: 'shelf-climate',
        name: 'Climate & Care',
        description: 'How can we re-write ecologies of care through the lens of indigenous heritage and the earth\\'s natural primitives?',
        is_public: true,
        created_at: datetime(),
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      })
      
      MERGE (u1)-[:OWNS]->(b1)
      MERGE (u2)-[:OWNS]->(b2)
      
      RETURN b1, b2
    `);
    
    // Add essays
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
        id: 15,
        title: "The idea that sperm race to the egg is just another macho myth",
        domain_name: "Aeon",
        author: "Robert D Martin",
        url: "https://aeon.co/essays/the-idea-that-sperm-race-to-the-egg-is-just-another-macho-myth"
      }
    ];
    
    // Add essays to bookshelves
    console.log('Adding essays to bookshelves...');
    for (const essay of essays) {
      await session.run(`
        MATCH (b:Bookshelf {id: 'shelf-writing'})
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
    
    // Add some essays to climate shelf
    await session.run(`
      MATCH (b:Bookshelf {id: 'shelf-climate'})
      MATCH (e:Essay {id: '15'})
      MERGE (b)-[:CONTAINS]->(e)
    `);
    
    console.log('Custom data setup complete!');
  } catch (error) {
    console.error('Error adding custom data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the function
addCustomData().then(() => {
  console.log('Setup complete!');
  process.exit(0);
}).catch(err => {
  console.error('Error during setup:', err);
  process.exit(1);
});
