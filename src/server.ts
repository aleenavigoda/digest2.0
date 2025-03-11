
import express from 'express';
import { createSession } from './lib/neo4j';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API endpoint to get all public bookshelves
app.get('/api/bookshelves', async (req, res) => {
  const session = createSession();
  try {
    const result = await session.run(`
      MATCH (b:Bookshelf)
      WHERE b.is_public = true
      RETURN b
      ORDER BY b.created_at DESC
    `);

    const bookshelves = result.records.map(record => {
      const b = record.get('b').properties;
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        is_public: b.is_public,
        created_at: b.created_at,
        image_url: b.image_url || null
      };
    });

    res.json(bookshelves);
  } catch (error) {
    console.error('Error fetching bookshelves:', error);
    res.status(500).json({ error: 'Failed to fetch bookshelves' });
  } finally {
    await session.close();
  }
});

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;
