
// Simple JavaScript Cypher query runner
const neo4j = require('neo4j-driver');
require('dotenv').config();

// Check all possible environment variable naming conventions
const neo4jUri = process.env.NEO4J_URI || 
                process.env.VITE_NEO4J_URI || 
                process.env.NEO4J_URL || 
                process.env.VITE_NEO4J_URL || 
                'bolt://localhost:7687';

const neo4jUser = process.env.NEO4J_USER || 
                 process.env.VITE_NEO4J_USER || 
                 process.env.NEO4J_USERNAME || 
                 process.env.VITE_NEO4J_USERNAME || 
                 'neo4j';

const neo4jPassword = process.env.NEO4J_PASSWORD || 
                     process.env.VITE_NEO4J_PASSWORD || 
                     'password';

console.log('Neo4j Connection Info:');
console.log('URI:', neo4jUri);
console.log('User:', neo4jUser);
console.log('Password:', neo4jPassword ? '(password set)' : '(no password)');

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// You can modify this query to run any Cypher query you want
const CYPHER_QUERY = `
  MATCH (n)
  RETURN n
  LIMIT 10
`;

async function runQuery() {
  const session = driver.session();

  try {
    console.log('Connected to Neo4j database');
    console.log('Running query:', CYPHER_QUERY);

    const result = await session.run(CYPHER_QUERY);

    console.log('\n--- Query Results ---');
    if (result.records.length === 0) {
      console.log('No results found.');
    } else {
      result.records.forEach((record, i) => {
        console.log(`Result ${i+1}:`, record.get('n')?.properties || record.toObject());
      });
    }

  } catch (error) {
    console.error('Error running query:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

runQuery()
  .catch(error => console.error('Unhandled error:', error));
