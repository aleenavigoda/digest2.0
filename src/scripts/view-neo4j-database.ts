
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables
const neo4jUri = process.env.VITE_NEO4J_URI || '';
const neo4jUser = process.env.VITE_NEO4J_USER || '';
const neo4jPassword = process.env.VITE_NEO4J_PASSWORD || '';

console.log('Connecting to Neo4j database...');
console.log('URI:', neo4jUri ? 'URI is set' : 'URI is missing');
console.log('User:', neo4jUser ? 'User is set' : 'User is missing');
console.log('Password:', neo4jPassword ? 'Password is set' : 'Password is missing');

if (!neo4jUri || !neo4jUser || !neo4jPassword) {
  console.error('Missing Neo4j credentials. Please check your .env file.');
  process.exit(1);
}

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

async function viewDatabase() {
  const session = driver.session();
  
  try {
    console.log('Connected to Neo4j database');
    
    // View all nodes in the database
    console.log('\n--- All Nodes ---');
    const nodesResult = await session.run('MATCH (n) RETURN labels(n) AS type, count(n) AS count');
    nodesResult.records.forEach(record => {
      console.log(`${record.get('type')}: ${record.get('count')} nodes`);
    });
    
    // View all relationships
    console.log('\n--- All Relationships ---');
    const relsResult = await session.run('MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count');
    relsResult.records.forEach(record => {
      console.log(`${record.get('type')}: ${record.get('count')} relationships`);
    });
    
    // View bookshelves
    console.log('\n--- Bookshelves ---');
    const bookshelvesResult = await session.run(`
      MATCH (b:Bookshelf)
      RETURN b.id AS id, b.name AS name, b.description AS description, b.is_public AS is_public
      LIMIT 10
    `);
    
    bookshelvesResult.records.forEach(record => {
      console.log(`ID: ${record.get('id')}`);
      console.log(`Name: ${record.get('name')}`);
      console.log(`Description: ${record.get('description')}`);
      console.log(`Public: ${record.get('is_public')}`);
      console.log('---');
    });
    
    // View users
    console.log('\n--- Users ---');
    const usersResult = await session.run(`
      MATCH (u:User)
      RETURN u.id AS id, u.name AS name, u.email AS email
      LIMIT 10
    `);
    
    usersResult.records.forEach(record => {
      console.log(`ID: ${record.get('id')}`);
      console.log(`Name: ${record.get('name')}`);
      console.log(`Email: ${record.get('email')}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

viewDatabase()
  .catch(error => console.error('Error in script:', error));
