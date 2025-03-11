import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Avatar } from "../ui/components/Avatar";

interface Bookshelf {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
}

// Mock data for bookshelf display
const MOCK_BOOKSHELVES: Bookshelf[] = [
  {
    id: 'shelf-writing',
    name: 'Writing & Craft',
    description: 'Essays about the art and craft of writing, from structure to style to process.',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png',
    is_public: true,
    created_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'shelf-climate',
    name: 'Climate & Care',
    description: 'How can we re-write ecologies of care through the lens of indigenous heritage and the earth\'s natural primitives?',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png',
    is_public: true,
    created_at: '2023-01-02T00:00:00.000Z'
  },
  {
    id: 'shelf-tech',
    name: 'Tech & Society',
    description: 'Exploring the intersection of technology and human society. How tech shapes our lives and future.',
    image_url: null,
    is_public: true,
    created_at: '2023-01-03T00:00:00.000Z'
  }
];

export default function BookshelfPage() {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simply use the mock data directly
    setBookshelves(MOCK_BOOKSHELVES);
    setLoading(false);
  }, []);

  return (
    <DefaultPageLayout>
      <div className="flex h-full flex-col items-start gap-6 p-10">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-heading-1 font-heading-1 text-default-font">
                Bookshelves
              </h1>
              <span className="text-body font-body text-subtext-color">
                Explore curated collections of essays from the best writers and thinkers.
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex items-start gap-6 overflow-x-auto pb-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <span>Loading bookshelves...</span>
                </div>
              ) : (
                bookshelves.map((shelf, index) => (
                  <div key={shelf.id} className="flex flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm hover:shadow-md transition-shadow" style={{ minWidth: '350px', width: '350px', flexShrink: 0 }}>
                    <div className="flex w-full items-center gap-4">
                      <Avatar
                        size="x-large"
                        image={shelf.image_url || "https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png"}
                      >
                        {shelf.name.charAt(0)}
                      </Avatar>
                      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                        <span className="text-caption-bold font-caption-bold text-brand-700">
                          {index === 0 ? "DIGEST" : "RADAR"}
                        </span>
                        <span className="text-heading-3 font-heading-3 text-default-font">
                          {shelf.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                      <span className="text-body font-body text-subtext-color">
                        {shelf.description}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}