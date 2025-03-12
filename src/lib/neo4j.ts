
import neo4j from 'neo4j-driver';

// Get environment variables from .env file
const neo4jUri = import.meta.env.VITE_NEO4J_URI || '';
const neo4jUser = import.meta.env.VITE_NEO4J_USER || '';
const neo4jPassword = import.meta.env.VITE_NEO4J_PASSWORD || '';

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Create a session factory
export const createSession = () => driver.session();

// Ensure driver is closed when app terminates
const closeDriver = () => {
  driver.close();
};

// Browser-safe approach to process listeners
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  process.on('SIGTERM', closeDriver);
  process.on('SIGINT', closeDriver);
}

export default driver;
import neo4j from 'neo4j-driver';

// Neo4j connection details
const neo4jUri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'password';

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Create and return a new session
export function createSession() {
  return driver.session();
}

export default driver;
