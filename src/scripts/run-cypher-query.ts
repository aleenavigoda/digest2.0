
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

// You can modify this query to run any Cypher query you want
const CYPHER_QUERY = `
  MATCH (n)
  RETURN n
  LIMIT 25
`;

async function runCustomQuery() {
  const session = driver.session();
  
  try {
    console.log('Running Cypher query:', CYPHER_QUERY);
    
    const result = await session.run(CYPHER_QUERY);
    
    console.log(`Query returned ${result.records.length} records:`);
    
    result.records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`);
      record.keys.forEach(key => {
        const value = record.get(key);
        if (value && typeof value === 'object' && value.properties) {
          console.log(`${key}: ${JSON.stringify(value.properties, null, 2)}`);
        } else {
          console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
        }
      });
    });
    
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

runCustomQuery()
  .catch(error => console.error('Error in script:', error));
