
// CommonJS version of add-more-bookshelves script
const neo4j = require('neo4j-driver');
require('dotenv').config();

async function addMoreBookshelves() {
  console.log('Adding more bookshelves to the database...');
  
  // Create Neo4j driver instance
  const driver = neo4j.driver(
    process.env.NEO4J_URI || 'neo4j://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || 'neo4j',
      process.env.NEO4J_PASSWORD || 'password'
    )
  );
  
  const session = driver.session();
  
  try {
    // Creating additional bookshelves
    const additionalBookshelves = [
      {
        id: 'shelf-philosophy',
        name: 'Philosophy Fundamentals',
        description: 'Deep dives into philosophical ideas that shape our understanding of the world.',
        is_public: true,
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      },
      {
        id: 'shelf-tech',
        name: 'Technology Trends',
        description: 'Latest developments in technology and how they might shape our future.',
        is_public: true,
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      },
      {
        id: 'shelf-history',
        name: 'Historical Perspectives',
        description: 'Essays that provide context to today\'s world through historical analysis.',
        is_public: true,
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      }
    ];
    
    for (const shelf of additionalBookshelves) {
      console.log(`Creating bookshelf: ${shelf.name}...`);
      
      const result = await session.run(`
        CREATE (b:Bookshelf {
          id: $id,
          name: $name,
          description: $description,
          is_public: $is_public,
          created_at: datetime(),
          image_url: $image_url
        })
        RETURN b
      `, shelf);
      
      if (result.records.length > 0) {
        console.log(`Successfully created bookshelf: ${shelf.name}`);
      }
    }
    
    console.log('Finished adding additional bookshelves!');
    
  } catch (error) {
    console.error('Error adding more bookshelves:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the function
addMoreBookshelves().then(() => {
  console.log('Script completed, exiting.');
  process.exit(0);
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
