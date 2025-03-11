"use client";

import React, { useEffect, useState } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Avatar } from "../ui/components/Avatar";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { Button } from "../ui/components/Button";
import { TextField } from "../ui/components/TextField";
import { Table } from "../ui/components/Table";
import { IconButton } from "../ui/components/IconButton";
import { supabase } from "../lib/supabase";
import { getPublicBookshelves, Bookshelf } from "../services/socialGraphService";

// Define the type for our URL data
interface UrlData {
  id: number;
  title: string;
  domain_name: string;
  author: string;
  date_published: string;
  image_url?: string;
  url?: string;
}

function BookshelfPage() {
  const [urlData, setUrlData] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [bookshelvesLoading, setBookshelvesLoading] = useState(true);
  const rowsPerPage = 7;

  const fetchUrls = async (page: number) => {
    setLoading(true);
    try {
      // Hardcode the limit to first 1632 IDs
      const maxId = 1632;
      
      // Calculate total pages based on fixed dataset size
      const totalCount = maxId;
      const calculatedTotalPages = Math.ceil(totalCount / rowsPerPage);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);

      // Calculate offset based on current page
      const offset = (page - 1) * rowsPerPage;
      let essaysData = [];

      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL ? "Set" : "Not set");

      try {
        // Fetch essays with IDs less than or equal to 1632
        const { data: essayResults, error: queryError } = await supabase
          .from('all_urls')
          .select('*')
          .order('id', { ascending: true })
          .range(offset, offset + rowsPerPage - 1);

        if (queryError) {
          console.error('Failed to fetch essays:', queryError);
        } else {
          essaysData = essayResults || [];
          console.log('Raw essay data:', essaysData);
        }
      } catch (supabaseError) {
        console.error('Supabase query error:', supabaseError);
        
        // Fallback: Use hardcoded sample data if the query fails
        essaysData = [
          { id: 1, title: "The Art of Programming", domain_name: "medium.com", author: "John Doe", date_published: "2023-05-15" },
          { id: 2, title: "Web Development in 2024", domain_name: "dev.to", author: "Jane Smith", date_published: "2024-01-10" },
          { id: 3, title: "Understanding React Hooks", domain_name: "reactjs.org", author: "React Team", date_published: "2023-11-22" },
          { id: 4, title: "TypeScript Best Practices", domain_name: "typescript.org", author: "TS Community", date_published: "2023-09-05" },
          { id: 5, title: "The Future of AI", domain_name: "ai-research.org", author: "Alex Johnson", date_published: "2024-02-18" }
        ];
      }

      console.log(`Fetched ${essaysData.length} essays for page ${page}`);
      setUrlData(essaysData);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
      
      // Set sample data as fallback
      setUrlData([
        { id: 1, title: "The Art of Programming", domain_name: "medium.com", author: "John Doe", date_published: "2023-05-15" },
        { id: 2, title: "Web Development in 2024", domain_name: "dev.to", author: "Jane Smith", date_published: "2024-01-10" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookshelves from Neo4j
  const fetchBookshelves = async () => {
    setBookshelvesLoading(true);
    try {
      const shelves = await getPublicBookshelves();
      console.log("Bookshelves fetched:", shelves);
      setBookshelves(shelves || []);
    } catch (error) {
      console.error("Failed to fetch bookshelves:", error);
      setBookshelves([]);
    } finally {
      setBookshelvesLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls(currentPage);
    fetchBookshelves();
  }, [currentPage]);

  // Log the data for debugging
  useEffect(() => {
    if (urlData.length > 0) {
      console.log("URL Data fetched:", urlData);
    }
  }, [urlData]);
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Explore our bookshelves
          </span>
          <div className="flex w-full flex-wrap items-start gap-4">
            {bookshelvesLoading ? (
              <div className="w-full text-center py-8">Loading bookshelves...</div>
            ) : bookshelves.length === 0 ? (
              <div className="w-full text-center py-8">No bookshelves found. Run setup-neo4j script to add sample data.</div>
            ) : (
              bookshelves.map((shelf, index) => (
                <div key={shelf.id} className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
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
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Browse all essays
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Button
                  variant="neutral-secondary"
                  icon="FeatherBlinds"
                  iconRight="FeatherChevronDown"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  All domains
                </Button>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={null}>
                      Favorites
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={null}>
                      Top Gainers
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={null}>
                      Top Losers
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={null}>
                      Recently Updated
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            <TextField
              className="h-auto grow shrink-0 basis-0"
              label=""
              helpText=""
              icon="FeatherSearch"
            >
              <TextField.Input
                className="w-56 grow shrink-0 basis-0"
                placeholder="What do you want to read?"
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField>
          </div>
          <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background shadow-sm overflow-x-auto flex-none">
            <Table
              header={
                <Table.HeaderRow>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Published on</Table.HeaderCell>
                  <Table.HeaderCell>Written by</Table.HeaderCell>
                  <Table.HeaderCell className="h-8 w-28 flex-none">
                    Date
                  </Table.HeaderCell>
                </Table.HeaderRow>
              }
            >
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <span className="text-body font-body text-default-font">Loading...</span>
                  </Table.Cell>
                </Table.Row>
              ) : urlData.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <span className="text-body font-body text-default-font">No data available</span>
                  </Table.Cell>
                </Table.Row>
              ) : (
                urlData.map((url) => (
                  <Table.Row key={url.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <img
                          className="h-6 w-6 flex-none rounded-md object-cover"
                          src={url.image_url || "https://res.cloudinary.com/subframe/image/upload/v1723780719/uploads/302/lf4i2zybfw9xxl56w6ce.png"}
                        />
                        <a 
                          href={url.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="truncate max-w-xs text-body-bold font-body-bold text-default-font hover:text-brand-600 hover:underline transition-colors" 
                          title={url.title}
                        >
                          {url.title || `Entry ${url.id}`}
                        </a>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption-bold font-caption-bold text-success-700">
                        {url.domain_name}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption-bold font-caption-bold text-default-font">
                        {url.author || "-"}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption font-caption text-default-font">
                        {url.date_published || "N/A"}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table>
            <div className="flex w-full items-center justify-center gap-1 px-4 py-4">
              <div className="flex items-center justify-center gap-1">
                <IconButton
                  icon="FeatherChevronFirst"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <IconButton
                  icon="FeatherChevronLeft"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
              </div>
              <div className="flex items-center justify-center gap-1">
                {(() => {
                  const visiblePages = [];
                  const maxVisiblePages = 5;
                  
                  // Always show first page
                  visiblePages.push(
                    <Button
                      key="page-1"
                      variant={currentPage === 1 ? "brand-secondary" : "neutral-tertiary"}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </Button>
                  );
                  
                  // Add ellipsis after first page if needed
                  if (currentPage > 3) {
                    visiblePages.push(
                      <span key="ellipsis-start" className="px-2">...</span>
                    );
                  }
                  
                  // Add pages around current page
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);
                  
                  for (let i = startPage; i <= endPage; i++) {
                    if (i > 1 && i < totalPages) {
                      visiblePages.push(
                        <Button
                          key={`page-${i}`}
                          variant={currentPage === i ? "brand-secondary" : "neutral-tertiary"}
                          onClick={() => setCurrentPage(i)}
                        >
                          {i}
                        </Button>
                      );
                    }
                  }
                  
                  // Add ellipsis before last page if needed
                  if (currentPage < totalPages - 2) {
                    visiblePages.push(
                      <span key="ellipsis-end" className="px-2">...</span>
                    );
                  }
                  
                  // Always show last page if there's more than one page
                  if (totalPages > 1) {
                    visiblePages.push(
                      <Button
                        key={`page-${totalPages}`}
                        variant={currentPage === totalPages ? "brand-secondary" : "neutral-tertiary"}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    );
                  }
                  
                  return visiblePages;
                })()}
              </div>
              <div className="flex items-center justify-center gap-1">
                <IconButton
                  icon="FeatherChevronRight"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
                <IconButton
                  icon="FeatherChevronLast"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default BookshelfPage;