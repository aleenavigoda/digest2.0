
// A simple browser-based Neo4j database viewer
const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get all possible environment variable names for Neo4j
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

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Set up Express server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Home page with database info and query form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Neo4j Database Browser</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        .header { background: #f0f0f0; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        button { padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        textarea { width: 100%; height: 100px; margin-bottom: 10px; padding: 8px; }
        .results { margin-top: 20px; }
        .load-sample { background: #2196F3; }
      </style>
    </head>
    <body>
      <h1>Neo4j Database Browser</h1>
      
      <div class="card">
        <div class="header">Connection Information</div>
        <p><strong>URI:</strong> ${neo4jUri}</p>
        <p><strong>User:</strong> ${neo4jUser}</p>
        <p><strong>Password:</strong> ${neo4jPassword ? '********' : '(not set)'}</p>
      </div>
      
      <div class="card">
        <div class="header">Database Overview</div>
        <div id="overview">Loading...</div>
        <button onclick="fetchOverview()">Refresh Overview</button>
      </div>
      
      <div class="card">
        <div class="header">Execute Cypher Query</div>
        <textarea id="query" placeholder="Enter your Cypher query here...">MATCH (n) RETURN n LIMIT 10</textarea>
        <div>
          <button onclick="executeQuery()">Execute Query</button>
          <button class="load-sample" onclick="loadSampleData()">Load Sample Data</button>
        </div>
        <div class="results">
          <h3>Results:</h3>
          <pre id="results">Execute a query to see results</pre>
        </div>
      </div>
      
      <div class="card">
        <div class="header">Sample Queries</div>
        <ul>
          <li><a href="#" onclick="setQuery('MATCH (n) RETURN n LIMIT 25')">View all nodes (limited to 25)</a></li>
          <li><a href="#" onclick="setQuery('MATCH (b:Bookshelf) RETURN b')">View all bookshelves</a></li>
          <li><a href="#" onclick="setQuery('MATCH (u:User) RETURN u')">View all users</a></li>
          <li><a href="#" onclick="setQuery('MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 25')">View relationships</a></li>
          <li><a href="#" onclick="setQuery('MATCH (b:Bookshelf)<-[r:OWNS]-(u:User) RETURN u.name AS Owner, b.name AS Bookshelf')">View bookshelf owners</a></li>
        </ul>
      </div>
      
      <script>
        function fetchOverview() {
          fetch('/api/overview')
            .then(response => response.json())
            .then(data => {
              document.getElementById('overview').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            })
            .catch(error => {
              document.getElementById('overview').innerHTML = '<pre class="error">Error: ' + error.message + '</pre>';
            });
        }
        
        function executeQuery() {
          const query = document.getElementById('query').value;
          
          fetch('/api/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          })
            .then(response => response.json())
            .then(data => {
              document.getElementById('results').innerHTML = JSON.stringify(data, null, 2);
            })
            .catch(error => {
              document.getElementById('results').innerHTML = 'Error: ' + error.message;
            });
        }
        
        function setQuery(query) {
          document.getElementById('query').value = query;
          return false;
        }
        
        function loadSampleData() {
          if (confirm('This will clear your database and load sample data. Continue?')) {
            fetch('/api/load-sample-data', { method: 'POST' })
              .then(response => response.json())
              .then(data => {
                alert(data.message);
                fetchOverview();
              })
              .catch(error => {
                alert('Error: ' + error.message);
              });
          }
        }
        
        // Initialize
        fetchOverview();
      </script>
    </body>
    </html>
  `);
});

// API endpoint to get database overview
app.get('/api/overview', async (req, res) => {
  const session = driver.session();
  try {
    // Count nodes by label
    const nodesResult = await session.run('MATCH (n) RETURN labels(n) AS type, count(n) AS count');
    const nodes = nodesResult.records.map(record => ({
      type: record.get('type').join(':'),
      count: record.get('count').toNumber()
    }));
    
    // Count relationships by type
    const relsResult = await session.run('MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count');
    const relationships = relsResult.records.map(record => ({
      type: record.get('type'),
      count: record.get('count').toNumber()
    }));
    
    res.json({ nodes, relationships });
  } catch (error) {
    console.error('Error getting overview:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// API endpoint to execute queries
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  const session = driver.session();
  try {
    const result = await session.run(query);
    const records = result.records.map(record => {
      const obj = {};
      record.keys.forEach(key => {
        const value = record.get(key);
        if (value && typeof value === 'object' && value.properties) {
          obj[key] = value.properties;
        } else {
          obj[key] = value;
        }
      });
      return obj;
    });
    
    res.json({ records, summary: { resultAvailableAfter: result.summary.resultAvailableAfter, resultConsumedAfter: result.summary.resultConsumedAfter } });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// API endpoint to load sample data
app.post('/api/load-sample-data', async (req, res) => {
  const session = driver.session();
  try {
    // Clear database
    await session.run('MATCH (n) DETACH DELETE n');
    
    // Create users
    await session.run(`
      CREATE (alice:User {id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com'})
      CREATE (bob:User {id: 'user-2', name: 'Bob Smith', email: 'bob@example.com'})
      CREATE (charlie:User {id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com'})
      RETURN alice, bob, charlie
    `);
    
    // Create bookshelves
    await session.run(`
      MATCH (alice:User {id: 'user-1'}), (bob:User {id: 'user-2'}), (charlie:User {id: 'user-3'})
      
      CREATE (shelf1:Bookshelf {id: 'shelf-1', name: 'Philosophy Essentials', description: 'Key works in philosophy', is_public: true})
      CREATE (shelf2:Bookshelf {id: 'shelf-2', name: 'Science Fiction', description: 'Best sci-fi essays', is_public: true})
      CREATE (shelf3:Bookshelf {id: 'shelf-3', name: 'Tech Analysis', description: 'Technology trends', is_public: true})
      CREATE (shelf4:Bookshelf {id: 'shelf-4', name: 'Private Collection', description: 'My private readings', is_public: false})
      
      CREATE (alice)-[:OWNS]->(shelf1)
      CREATE (bob)-[:OWNS]->(shelf2)
      CREATE (charlie)-[:OWNS]->(shelf3)
      CREATE (alice)-[:OWNS]->(shelf4)
      
      RETURN shelf1, shelf2, shelf3, shelf4
    `);
    
    // Create some essays
    await session.run(`
      MATCH (shelf1:Bookshelf {id: 'shelf-1'}), 
            (shelf2:Bookshelf {id: 'shelf-2'}),
            (shelf3:Bookshelf {id: 'shelf-3'})
      
      CREATE (essay1:Essay {id: 'essay-1', title: 'The Meaning of Life', author: 'Philosopher X'})
      CREATE (essay2:Essay {id: 'essay-2', title: 'Future of AI', author: 'Tech Writer Y'})
      CREATE (essay3:Essay {id: 'essay-3', title: 'Space Exploration', author: 'Astronomer Z'})
      
      CREATE (shelf1)-[:CONTAINS]->(essay1)
      CREATE (shelf3)-[:CONTAINS]->(essay2)
      CREATE (shelf2)-[:CONTAINS]->(essay3)
      
      RETURN essay1, essay2, essay3
    `);
    
    res.json({ message: 'Sample data loaded successfully!' });
  } catch (error) {
    console.error('Error loading sample data:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Start server
const PORT = process.env.PORT || 3333;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Neo4j browser running at http://localhost:${PORT}`);
  console.log(`Connected to Neo4j at ${neo4jUri}`);
});
