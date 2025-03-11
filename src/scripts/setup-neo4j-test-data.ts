
import { 
  createUser, 
  createBookshelf, 
  addEssayToBookshelf,
  createFriendship,
  addCollaborator
} from '../services/socialGraphService';
import driver from '../lib/neo4j';

// This script creates sample data for testing the Neo4j graph
async function setupTestData() {
  try {
    // Create test users
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

    const charlie = await createUser({
      id: 'user-charlie',
      name: 'Charlie Garcia',
      email: 'charlie@example.com'
    });

    console.log('Created test users');

    // Create friendships
    await createFriendship('user-alice', 'user-bob');
    await createFriendship('user-alice', 'user-charlie');
    console.log('Created friendships');

    // Create bookshelves
    const aliceShelf1 = await createBookshelf({
      id: 'shelf-alice-1',
      name: 'Writing Essays',
      description: 'Essays about writing and creativity',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString()
    });

    const aliceShelf2 = await createBookshelf({
      id: 'shelf-alice-2',
      name: 'Philosophy',
      description: 'Deep philosophical essays',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString()
    });

    const bobShelf = await createBookshelf({
      id: 'shelf-bob-1',
      name: 'Tech Essays',
      description: 'Essays about technology and its impact',
      is_public: true,
      owner_id: 'user-bob',
      created_at: new Date().toISOString()
    });

    const charlieShelf = await createBookshelf({
      id: 'shelf-charlie-1',
      name: 'Science & Nature',
      description: 'Essays about science and the natural world',
      is_public: false,
      owner_id: 'user-charlie',
      created_at: new Date().toISOString()
    });

    console.log('Created bookshelves');

    // Add essays to bookshelves (using IDs from your existing data)
    await addEssayToBookshelf('shelf-alice-1', {
      id: 1,
      title: 'Children today are suffering a severe deficit of play',
      domain_name: 'Aeon',
      author: 'Peter Gray',
      url: 'https://aeon.co/essays/children-today-are-suffering-a-severe-deficit-of-play',
      date_published: '2013-09-18'
    });

    await addEssayToBookshelf('shelf-alice-2', {
      id: 8,
      title: 'Elon Musk puts his case for a multi-planet civilisation',
      domain_name: 'Aeon',
      author: 'Ross Andersen',
      url: 'https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation'
    });

    await addEssayToBookshelf('shelf-bob-1', {
      id: 8,
      title: 'Elon Musk puts his case for a multi-planet civilisation',
      domain_name: 'Aeon',
      author: 'Ross Andersen',
      url: 'https://aeon.co/essays/elon-musk-puts-his-case-for-a-multi-planet-civilisation'
    });

    await addEssayToBookshelf('shelf-bob-1', {
      id: 22, 
      title: 'Sugar is a toxic agent that creates conditions for disease',
      domain_name: 'Aeon',
      author: 'Gary Taubes',
      url: 'https://aeon.co/essays/sugar-is-a-toxic-agent-that-creates-conditions-for-disease'
    });

    await addEssayToBookshelf('shelf-charlie-1', {
      id: 1632,
      title: 'The devotion of the human dad separates us from other apes',
      domain_name: 'Aeon',
      author: 'Anna Machin',
      url: 'https://aeon.co/essays/the-devotion-of-the-human-dad-separates-us-from-other-apes'
    });

    console.log('Added essays to bookshelves');

    // Set up collaboration
    await addCollaborator('shelf-alice-1', 'user-bob');
    console.log('Added collaborators');

    console.log('Test data setup complete!');

  } catch (error) {
    console.error('Error setting up test data:', error);
  } finally {
    // Close the driver to end the application properly
    await driver.close();
  }
}

// Run the setup
setupTestData();
