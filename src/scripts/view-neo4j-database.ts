import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables
const neo4jUri = process.env.NEO4J_URI || '';
const neo4jUser = process.env.NEO4J_USERNAME || '';
const neo4jPassword = process.env.NEO4J_PASSWORD || '';

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

    // Get all nodes
    console.log('\n--- All Nodes ---');
    const nodesResult = await session.run('MATCH (n) RETURN n LIMIT 100');

    if (nodesResult.records.length === 0) {
      console.log('No nodes found in the database.');
    } else {
      nodesResult.records.forEach((record, i) => {
        const node = record.get('n');
        console.log(`Node ${i+1}:`, node.properties);
      });
    }

    // Get all relationships
    console.log('\n--- All Relationships ---');
    const relsResult = await session.run(
      'MATCH ()-[r]->() RETURN DISTINCT type(r) AS type, count(r) AS count'
    );

    if (relsResult.records.length === 0) {
      console.log('No relationships found in the database.');
    } else {
      relsResult.records.forEach(record => {
        console.log(`${record.get('type')}: ${record.get('count')}`);
      });
    }

  } catch (error) {
    console.error('Error viewing database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

viewDatabase()
  .catch(error => console.error('Unhandled error:', error));