
import neo4j from 'neo4j-driver';

// Get environment variables - should be added to your .env file
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

// Add listener to close the driver when the app is terminated
process.on('SIGTERM', closeDriver);
process.on('SIGINT', closeDriver);

export default driver;
