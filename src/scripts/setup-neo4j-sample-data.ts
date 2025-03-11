
import { 
  createUser, 
  createBookshelf, 
  addEssayToBookshelf,
  createFriendship,
  addCollaborator
} from '../services/socialGraphService';
import driver from '../lib/neo4j';

// This script creates sample data for the Neo4j graph
async function setupSampleData() {
  try {
    console.log('Setting up sample Neo4j data...');
    
    // Create sample users
    const alice = await createUser({
      id: 'user-alice',
      name: 'Alice Smith',
      email: 'alice@example.com',
      avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    const bob = await createUser({
      id: 'user-bob',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      avatar_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
    });

    console.log('Created sample users');

    // Create friendships
    await createFriendship('user-alice', 'user-bob');
    console.log('Created friendships');

    // Create bookshelves
    const writingShelf = await createBookshelf({
      id: 'shelf-writing',
      name: 'Writing on Writing',
      description: 'The best essays from the best essayists on improving your craft, finding your audience, and owning your voice.',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    const climateShelf = await createBookshelf({
      id: 'shelf-climate',
      name: 'Climate & Care',
      description: 'How can we re-write ecologies of care through the lens of indigenous heritage and the earth\'s natural primitives?',
      is_public: true,
      owner_id: 'user-bob',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
    });

    console.log('Created bookshelves');

    // Add essays to bookshelves (using IDs from existing data)
    await addEssayToBookshelf('shelf-writing', {
      id: 1,
      title: 'Children today are suffering a severe deficit of play',
      domain_name: 'Aeon',
      author: 'Peter Gray',
      url: 'https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play',
      date_published: '2013-09-18'
    });

    await addEssayToBookshelf('shelf-writing', {
      id: 8,
      title: 'Elon Musk puts his case for a multi-planet civilisation',
      domain_name: 'Aeon',
      author: 'Ross Andersen',
      url: 'https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation'
    });

    await addEssayToBookshelf('shelf-climate', {
      id: 15,
      title: 'The idea that sperm race to the egg is just another macho myth',
      domain_name: 'Aeon',
      author: 'Robert D Martin',
      url: 'https://aeon.co/essays/the-idea-that-sperm-race-to-the-egg-is-just-another-macho-myth'
    });

    console.log('Added essays to bookshelves');
    console.log('Sample data setup complete!');
  } catch (error) {
    console.error('Error setting up sample data:', error);
  } finally {
    await driver.close();
  }
}

// Run the setup
setupSampleData();
