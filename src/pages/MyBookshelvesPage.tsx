
import React, { useEffect, useState } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Button } from "../ui/components/Button";
import { TextField } from "../ui/components/TextField";
import { IconButton } from "../ui/components/IconButton";
import { 
  getUserBookshelves, 
  createBookshelf, 
  Bookshelf 
} from "../services/socialGraphService";

// Mock user ID for development
const MOCK_USER_ID = "user-123";

function MyBookshelvesPage() {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBookshelfName, setNewBookshelfName] = useState("");
  const [newBookshelfDescription, setNewBookshelfDescription] = useState("");

  // Fetch user's bookshelves
  const fetchBookshelves = async () => {
    setLoading(true);
    try {
      const shelves = await getUserBookshelves(MOCK_USER_ID);
      setBookshelves(shelves);
    } catch (error) {
      console.error("Failed to fetch bookshelves:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new bookshelf
  const handleCreateBookshelf = async () => {
    if (!newBookshelfName) return;
    
    try {
      const newBookshelf: Bookshelf = {
        id: `shelf-${Date.now()}`,
        name: newBookshelfName,
        description: newBookshelfDescription,
        is_public: true,
        owner_id: MOCK_USER_ID,
        created_at: new Date().toISOString()
      };
      
      await createBookshelf(newBookshelf);
      setNewBookshelfName("");
      setNewBookshelfDescription("");
      fetchBookshelves();
    } catch (error) {
      console.error("Failed to create bookshelf:", error);
    }
  };

  useEffect(() => {
    fetchBookshelves();
  }, []);

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            My Bookshelves
          </span>
          
          {/* Create new bookshelf form */}
          <div className="w-full p-6 border border-neutral-border rounded-md shadow-sm">
            <h3 className="text-heading-3 font-heading-3 mb-4">Create New Bookshelf</h3>
            <div className="flex flex-col gap-4">
              <TextField
                label="Bookshelf Name"
                helpText=""
              >
                <TextField.Input
                  placeholder="e.g., Tech Essays"
                  value={newBookshelfName}
                  onChange={(e) => setNewBookshelfName(e.target.value)}
                />
              </TextField>
              
              <TextField
                label="Description"
                helpText=""
              >
                <TextField.Input
                  placeholder="What kind of essays will you collect here?"
                  value={newBookshelfDescription}
                  onChange={(e) => setNewBookshelfDescription(e.target.value)}
                />
              </TextField>
              
              <Button
                variant="brand-primary"
                onClick={handleCreateBookshelf}
                disabled={!newBookshelfName}
              >
                Create Bookshelf
              </Button>
            </div>
          </div>
          
          {/* Bookshelves list */}
          <div className="w-full mt-8">
            <h3 className="text-heading-3 font-heading-3 mb-4">Your Bookshelves</h3>
            
            {loading ? (
              <p>Loading your bookshelves...</p>
            ) : bookshelves.length === 0 ? (
              <p>You haven't created any bookshelves yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookshelves.map((shelf) => (
                  <div 
                    key={shelf.id} 
                    className="p-6 border border-neutral-border rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-heading-4 font-heading-4 mb-2">{shelf.name}</h4>
                    <p className="text-body text-subtext-color mb-4">{shelf.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-caption-bold font-caption-bold text-brand-700">
                        {shelf.is_public ? "Public" : "Private"}
                      </span>
                      <Button 
                        variant="neutral-secondary"
                        onClick={() => {/* Navigate to detail view */}}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default MyBookshelvesPage;
