
import { createSession } from '../../lib/neo4j';
import { Bookshelf } from '../../services/bookshelfService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = createSession();
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
      } as Bookshelf;
    });

    await session.close();
    return res.status(200).json(bookshelves);
  } catch (error) {
    console.error('Error fetching bookshelves:', error);
    return res.status(500).json({ message: 'Error fetching bookshelves', error });
  }
}
