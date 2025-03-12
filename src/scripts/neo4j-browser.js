const neo4j = require('neo4j-driver');
require('dotenv').config();

// Get Neo4j connection details from environment variables
const neo4jUri = process.env.VITE_NEO4J_URI;
const neo4jUser = process.env.VITE_NEO4J_USER;
const neo4jPassword = process.env.VITE_NEO4J_PASSWORD;

console.log('Neo4j Connection Details:');
console.log('URI:', neo4jUri ? 'Set ✓' : 'Missing ✗');
console.log('User:', neo4jUser ? 'Set ✓' : 'Missing ✗');
console.log('Password:', neo4jPassword ? 'Set ✓' : 'Missing ✗');

if (!neo4jUri || !neo4jUser || !neo4jPassword) {
  console.error('Error: Missing Neo4j credentials in .env file');
  process.exit(1);
}

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword),
  { encrypted: process.env.NODE_ENV === 'production' }
);

async function viewDatabase() {
  const session = driver.session();

  try {
    console.log('\n===== NEO4J DATABASE BROWSER =====');

    // Check connection
    await session.run('RETURN 1');
    console.log('✅ Connected to Neo4j database');

    // Count all nodes
    const nodeCountResult = await session.run('MATCH (n) RETURN count(n) as count');
    const nodeCount = nodeCountResult.records[0].get('count').toNumber();
    console.log(`\n📊 Total nodes: ${nodeCount}`);

    // Get node types and counts
    console.log('\n📋 NODE TYPES:');
    const nodeTypesResult = await session.run('MATCH (n) RETURN DISTINCT labels(n) AS type, count(*) AS count ORDER BY count DESC');
    if (nodeTypesResult.records.length === 0) {
      console.log('   No nodes found');
    } else {
      nodeTypesResult.records.forEach(record => {
        console.log(`   ${record.get('type')}: ${record.get('count').toNumber()} nodes`);
      });
    }

    // Get relationship types and counts
    console.log('\n🔗 RELATIONSHIP TYPES:');
    const relTypesResult = await session.run('MATCH ()-[r]->() RETURN DISTINCT type(r) AS type, count(*) AS count ORDER BY count DESC');
    if (relTypesResult.records.length === 0) {
      console.log('   No relationships found');
    } else {
      relTypesResult.records.forEach(record => {
        console.log(`   ${record.get('type')}: ${record.get('count').toNumber()} relationships`);
      });
    }

    // Sample data (first 5 nodes)
    console.log('\n📝 SAMPLE DATA (5 nodes):');
    const sampleDataResult = await session.run('MATCH (n) RETURN n LIMIT 5');
    if (sampleDataResult.records.length === 0) {
      console.log('   No sample data found');
    } else {
      sampleDataResult.records.forEach((record, i) => {
        const node = record.get('n');
        console.log(`   Node ${i+1} (${node.labels.join(', ')}): ${JSON.stringify(node.properties)}`);
      });
    }

    // Check for bookshelves specifically
    console.log('\n📚 BOOKSHELF DATA:');
    const bookshelvesResult = await session.run('MATCH (b:Bookshelf) RETURN b LIMIT 10');
    if (bookshelvesResult.records.length === 0) {
      console.log('   No bookshelves found');
    } else {
      bookshelvesResult.records.forEach((record, i) => {
        const shelf = record.get('b').properties;
        console.log(`   Bookshelf ${i+1}: ${JSON.stringify(shelf)}`);
      });
    }

  } catch (error) {
    console.error('❌ Error accessing Neo4j database:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
  } finally {
    await session.close();
    await driver.close();
    console.log('\n===== DATABASE BROWSER CLOSED =====');
  }
}

// Run the function
viewDatabase()
  .catch(error => console.error('Unhandled error:', error));