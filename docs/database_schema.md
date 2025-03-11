
# Bookshelf App - Neo4j Graph Database Schema

## Node Types

### User
- Properties:
  - id (string): Unique identifier
  - name (string): User's display name
  - email (string): User's email address
  - avatar_url (string, optional): URL to user's profile image

### Bookshelf
- Properties:
  - id (string): Unique identifier
  - name (string): Bookshelf name
  - description (string): Bookshelf description
  - is_public (boolean): Whether the bookshelf is visible to other users
  - owner_id (string): ID of the user who created the shelf
  - created_at (string): ISO timestamp of creation

### Essay
- Properties:
  - id (number): Unique identifier (matching Supabase's all_urls table)
  - title (string): Essay title
  - domain_name (string): Source website
  - author (string): Essay author
  - url (string): Link to the essay
  - date_published (string, optional): Publication date
  - image_url (string, optional): URL to essay image

## Relationships

### User → Bookshelf
- `:OWNS`: A user owns a bookshelf
- `:CAN_EDIT`: A user can edit a bookshelf (for collaborators)

### Bookshelf → Essay
- `:CONTAINS`: A bookshelf contains an essay

### User → User
- `:FRIEND`: Users are connected as friends (bidirectional)

## Key Queries

### Get a user's personal bookshelves
```cypher
MATCH (u:User {id: $userId})-[:OWNS]->(b:Bookshelf)
RETURN b
ORDER BY b.created_at DESC
```

### Get bookshelves a user can collaborate on
```cypher
MATCH (u:User {id: $userId})-[:CAN_EDIT]->(b:Bookshelf)
WHERE NOT (u)-[:OWNS]->(b)
RETURN b
```

### Get essays in a bookshelf
```cypher
MATCH (b:Bookshelf {id: $bookshelfId})-[:CONTAINS]->(e:Essay)
RETURN e
```

### Get essay recommendations from friends' bookshelves
```cypher
MATCH (u:User {id: $userId})-[:FRIEND]-(friend:User)
MATCH (friend)-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e:Essay)
WHERE NOT ((u)-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e))
RETURN e, count(friend) as friendCount
ORDER BY friendCount DESC
LIMIT 10
```

### Find similar users based on essay interests
```cypher
MATCH (u:User {id: $userId})-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e:Essay)
MATCH (other:User)-[:OWNS]->(:Bookshelf)-[:CONTAINS]->(e)
WHERE u.id <> other.id
AND NOT (u)-[:FRIEND]-(other)
RETURN other, count(e) as commonEssays
ORDER BY commonEssays DESC
LIMIT 5
```
