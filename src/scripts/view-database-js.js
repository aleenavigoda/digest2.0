
// Simple JavaScript Neo4j database viewer
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
