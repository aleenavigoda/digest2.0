
// ES Module compatible script to check and add bookshelves if needed
import { createSession } from '../lib/neo4j.js';

async function checkAndAddBookshelves() {
  console.log('Checking bookshelves in the database...');
  
  const session = createSession();
  
  try {
    // First, check existing bookshelves
    const checkResult = await session.run(`
      MATCH (b:Bookshelf) 
      RETURN b.id, b.name
    `);
    
    console.log('Current bookshelves in database:');
    const existingIds = [];
    checkResult.records.forEach(record => {
      const id = record.get('b.id');
      existingIds.push(id);
      console.log(`- ${record.get('b.name')} (${id})`);
    });
    
    // Define additional bookshelves
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
      },
      {
        id: 'shelf-science',
        name: 'Modern Science',
        description: 'Groundbreaking scientific discoveries and their implications.',
        is_public: true,
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      },
      {
        id: 'shelf-culture',
        name: 'Cultural Analysis',
        description: 'Understanding our society through cultural lenses and critical theory.',
        is_public: true,
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
      },
      {
        id: 'shelf-economics',
        name: 'Economic Thought',
        description: 'Essays on economic theories, market trends, and financial systems.',
        is_public: true,
        image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
      }
    ];
    
    // Filter out bookshelves that already exist
    const shelvesToAdd = additionalBookshelves.filter(shelf => !existingIds.includes(shelf.id));
    
    if (shelvesToAdd.length === 0) {
      console.log('All additional bookshelves already exist in the database! No new shelves needed.');
    } else {
      console.log(`Adding ${shelvesToAdd.length} new bookshelves...`);
      
      for (const shelf of shelvesToAdd) {
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
    }
    
  } catch (error) {
    console.error('Error checking/adding bookshelves:', error);
  } finally {
    await session.close();
  }
}

// Run the function
checkAndAddBookshelves().then(() => {
  console.log('Script completed, exiting.');
  process.exit(0);
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
