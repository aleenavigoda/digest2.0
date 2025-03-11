
import React, { useEffect, useState } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Avatar } from "../ui/components/Avatar";
import { createClient } from "@supabase/supabase-js";

interface Bookshelf {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
}

export default function BookshelfPage() {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookshelves() {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error("Supabase URL or key is missing");
          setLoading(false);
          return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data, error } = await supabase
          .from("bookshelves")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching bookshelves:", error);
        } else {
          console.log("Bookshelves fetched:", data);
          setBookshelves(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch bookshelves:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookshelves();
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
