
import driver from '../lib/neo4j';

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
