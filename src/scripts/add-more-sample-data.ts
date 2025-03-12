
import { createBookshelf, addEssayToBookshelf } from '../services/socialGraphService';
import driver from '../lib/neo4j';

// This script adds more bookshelves and essays to the Neo4j database
async function addMoreSampleData() {
  try {
    console.log('Adding more sample bookshelves and essays...');
    
    // Create additional bookshelves
    const scienceShelf = await createBookshelf({
      id: 'shelf-science',
      name: 'Scientific Discoveries',
      description: 'Fascinating recent discoveries and breakthroughs in various scientific fields.',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    const artShelf = await createBookshelf({
      id: 'shelf-art',
      name: 'Art & Creativity',
      description: 'Essays exploring the boundaries of human creativity and artistic expression.',
      is_public: true,
      owner_id: 'user-bob',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
    });

    const psychologyShelf = await createBookshelf({
      id: 'shelf-psychology',
      name: 'Human Psychology',
      description: 'Understanding the complexities of the human mind and behavior.',
      is_public: true,
      owner_id: 'user-charlie',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    const futurismShelf = await createBookshelf({
      id: 'shelf-futurism',
      name: 'Future Possibilities',
      description: 'Speculations and predictions about the future of humanity and technology.',
      is_public: true,
      owner_id: 'user-alice',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png'
    });

    const economicsShelf = await createBookshelf({
      id: 'shelf-economics',
      name: 'Economic Insights',
      description: 'Essays on economic trends, theories, and their impact on society.',
      is_public: true,
      owner_id: 'user-bob',
      created_at: new Date().toISOString(),
      image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png'
    });

    console.log('Added more bookshelves');

    // Add some essays to the new bookshelves
    await addEssayToBookshelf('shelf-science', {
      id: 20,
      title: 'The mysterious dark energy that's making the universe expand faster',
      domain_name: 'New Scientist',
      author: 'Abigail Beall',
      url: 'https://example.com/dark-energy',
      date_published: '2023-07-22'
    });

    await addEssayToBookshelf('shelf-science', {
      id: 21,
      title: 'How quantum computers could change the world',
      domain_name: 'MIT Technology Review',
      author: 'Quantum Expert',
      url: 'https://example.com/quantum-computing',
      date_published: '2023-09-10'
    });

    await addEssayToBookshelf('shelf-art', {
      id: 22,
      title: 'AI-generated art: creativity or automation?',
      domain_name: 'Art Today',
      author: 'Creative Thinker',
      url: 'https://example.com/ai-art',
      date_published: '2023-08-15'
    });

    await addEssayToBookshelf('shelf-art', {
      id: 23,
      title: 'Renaissance techniques in modern painting',
      domain_name: 'Art History',
      author: 'Historical Artist',
      url: 'https://example.com/renaissance-modern',
      date_published: '2023-10-05'
    });

    await addEssayToBookshelf('shelf-psychology', {
      id: 24,
      title: 'The psychology of decision-making under uncertainty',
      domain_name: 'Psychology Today',
      author: 'Mind Expert',
      url: 'https://example.com/decision-psychology',
      date_published: '2023-11-18'
    });

    await addEssayToBookshelf('shelf-psychology', {
      id: 25,
      title: 'How trauma reshapes the brain',
      domain_name: 'Neuroscience Review',
      author: 'Brain Researcher',
      url: 'https://example.com/trauma-brain',
      date_published: '2023-12-03'
    });

    await addEssayToBookshelf('shelf-futurism', {
      id: 26,
      title: 'What life might look like in 2100',
      domain_name: 'Future Insights',
      author: 'Tomorrow Thinker',
      url: 'https://example.com/life-2100',
      date_published: '2024-01-12'
    });

    await addEssayToBookshelf('shelf-futurism', {
      id: 27,
      title: 'Colonizing Mars: challenges and possibilities',
      domain_name: 'Space Review',
      author: 'Space Explorer',
      url: 'https://example.com/mars-colonization',
      date_published: '2024-02-20'
    });

    await addEssayToBookshelf('shelf-economics', {
      id: 28,
      title: 'The future of work in an automated economy',
      domain_name: 'Economic Perspectives',
      author: 'Economy Analyst',
      url: 'https://example.com/future-work',
      date_published: '2024-03-05'
    });

    await addEssayToBookshelf('shelf-economics', {
      id: 29,
      title: 'Universal basic income: utopia or necessity?',
      domain_name: 'Policy Review',
      author: 'Social Economist',
      url: 'https://example.com/ubi-analysis',
      date_published: '2024-03-15'
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
addMoreSampleData();
