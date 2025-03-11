
import { createBookshelf, addEssayToBookshelf } from '../services/socialGraphService';
import driver from '../lib/neo4j';

// This script adds more bookshelves to demonstrate horizontal scrolling
async function addMoreBookshelves() {
  try {
    console.log('Adding more sample bookshelves...');
    
    // Create additional bookshelves
    const techShelf = await createBookshelf({
      id: 'shelf-tech',
      name: 'Technology Frontiers',
      description: 'Essays exploring cutting-edge technology and its implications for society.',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    const philosophyShelf = await createBookshelf({
      id: 'shelf-philosophy',
      name: 'Modern Philosophy',
      description: 'Contemporary philosophical perspectives on modern life, ethics, and meaning.',
      is_public: true,
      owner_id: 'user-bob',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
    });

    const historyShelf = await createBookshelf({
      id: 'shelf-history',
      name: 'Historical Perspectives',
      description: 'Looking at current events through the lens of historical patterns and precedents.',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    const biologyShelf = await createBookshelf({
      id: 'shelf-biology',
      name: 'Biological Wonders',
      description: 'Fascinating discoveries from the world of biology and natural sciences.',
      is_public: true,
      owner_id: 'user-bob',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
    });

    console.log('Added more bookshelves');

    // Add some essays to the new bookshelves
    await addEssayToBookshelf('shelf-tech', {
      id: 5,
      title: 'How social media changed the world',
      domain_name: 'Medium',
      author: 'Technology Insider',
      url: 'https://medium.com/example/social-media-world',
      date_published: '2023-05-15'
    });

    await addEssayToBookshelf('shelf-philosophy', {
      id: 10,
      title: 'The ethics of artificial intelligence',
      domain_name: 'Philosophy Today',
      author: 'Ethics Expert',
      url: 'https://philosophy-today.com/ai-ethics',
      date_published: '2024-01-10'
    });

    console.log('Added essays to new bookshelves');
    console.log('Additional sample data setup complete!');
  } catch (error) {
    console.error('Error adding more sample data:', error);
  } finally {
    await driver.close();
  }
}

// Run the script
addMoreBookshelves();
import { createSession } from '../lib/neo4j';
import * as neo4j from 'neo4j-driver';

async function addMoreBookshelves() {
  console.log('Adding more bookshelves to the database...');
  
  const session = createSession();
  
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
