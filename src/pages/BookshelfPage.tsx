import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { TextField } from "../ui/components/TextField";
import { Table } from "../ui/components/Table";
import { IconButton } from "../ui/components/IconButton";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { getPublicBookshelves, Bookshelf } from "../services/bookshelfService";
import { getAllEssays, Essay } from "../services/essayService";

function BookshelfPage() {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [bookshelvesLoading, setBookshelvesLoading] = useState(true);
  const [essaysLoading, setEssaysLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All domains");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const itemsPerPage = 10;

  // Fetch bookshelves from Neo4j
  useEffect(() => {
    const fetchBookshelves = async () => {
      try {
        setBookshelvesLoading(true);
        const data = await getPublicBookshelves();
        setBookshelves(data);
      } catch (error) {
        console.error("Error fetching bookshelves:", error);
      } finally {
        setBookshelvesLoading(false);
      }
    };

    fetchBookshelves();
  }, []);

  // Fetch essays from Supabase (or mock data if Supabase fails)
  useEffect(() => {
    const fetchEssays = async () => {
      try {
        setEssaysLoading(true);
        console.log("Fetching essays data from Supabase...");

        // Try to get real data with domain filter and search query
        const data = await getAllEssays(selectedDomain, searchQuery);
        console.log("Essay data received:", data ? data.length : 0, "items");

        if (data && data.length > 0) {
          // Only use the data if it's not empty
          console.log("Using real Supabase data");
          setEssays(data);
        } else {
          console.warn("No data from Supabase, using mock data");
          // Using import prevents potential circular dependency
          import("../services/essayService").then((module) => {
            setEssays(module.MOCK_ESSAYS);
          });
        }
      } catch (error) {
        console.error("Error in essay fetch effect:", error);
        // Fallback to mock data if something goes wrong
        import("../services/essayService").then((module) => {
          setEssays(module.MOCK_ESSAYS);
        });
      } finally {
        setEssaysLoading(false);
      }
    };

    fetchEssays();
  }, [selectedDomain, searchQuery]);

  // No need for client-side filtering as search is now handled by Supabase
  const filteredEssays = essays;

  // Paginate essays - optimized for larger dataset
  const indexOfLastEssay = currentPage * itemsPerPage;
  const indexOfFirstEssay = indexOfLastEssay - itemsPerPage;
  const currentEssays = filteredEssays.slice(
    indexOfFirstEssay,
    indexOfLastEssay,
  );
  const totalPages = Math.ceil(filteredEssays.length / itemsPerPage);

  // For very large datasets, limit the maximum visible pages to improve performance
  const maxVisiblePages = Math.min(totalPages, 100);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="text-heading-2 font-heading-2 text-default-font">
            Explore our bookshelves
          </span>
          <div className="relative w-full">
            <div
              id="bookshelves-container"
              className="flex w-full items-start gap-4 overflow-x-auto pb-2 hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bookshelvesLoading ? (
                <div className="flex items-center justify-center p-8 w-full">
                  <span>Loading bookshelves...</span>
                </div>
              ) : bookshelves.length === 0 ? (
                <div className="flex items-center justify-center p-8 w-full">
                  <span>No bookshelves found.</span>
                </div>
              ) : (
                <>
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-2xl text-brand-500 hover:text-brand-700 flex items-center justify-center w-8 h-8 bg-white bg-opacity-70 rounded-full shadow-sm"
                    onClick={() => {
                      const container = document.getElementById(
                        "bookshelves-container",
                      );
                      if (container) {
                        container.scrollBy({ left: 300, behavior: "smooth" });
                      }
                    }}
                    aria-label="Scroll right"
                  >
                    &gt;
                  </button>
                  {bookshelves.map((shelf, index) => (
                    <div
                      key={shelf.id}
                      className="flex flex-col items-start gap-4 self-stretch rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm min-w-[300px] max-w-[300px] mx-2 my-1"
                    >
                      <div className="flex w-full items-center gap-4">
                        <Avatar 
                          size="x-large" 
                          image={shelf.image_url || ""}
                          style={{
                            background: `linear-gradient(135deg, 
                              hsl(${(index * 137) % 360}, 80%, 65%), 
                              hsl(${((index * 137) + 40) % 360}, 70%, 50%))`,
                          }}
                        >
                          {shelf.name.charAt(0)}
                        </Avatar>
                        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                          <span className="text-caption-bold font-caption-bold text-brand-700">
                            {shelf.core_curator || (index === 0 ? "DIGEST" : "RADAR")}
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
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Browse all essays
          </span>
          <div className="flex flex-wrap items-center gap-2 w-full">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Button
                  variant="neutral-secondary"
                  icon="FeatherBlinds"
                  iconRight="FeatherChevronDown"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  {selectedDomain}
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
                    <DropdownMenu.DropdownItem
                      icon={null}
                      onClick={() => {
                        setSelectedDomain("All domains");
                        setCurrentPage(1); // Reset to first page when filter changes
                      }}
                    >
                      All domains
                    </DropdownMenu.DropdownItem>
                    {Array.from(
                      new Set(essays.map((essay) => essay.domain_name)),
                    )
                      .sort() // Sort domains alphabetically
                      .map((domain) => (
                        <DropdownMenu.DropdownItem
                          key={domain}
                          icon={null}
                          onClick={() => {
                            setSelectedDomain(domain);
                            setCurrentPage(1); // Reset to first page when filter changes
                          }}
                        >
                          {domain}
                        </DropdownMenu.DropdownItem>
                      ))}
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            <TextField
              className="h-auto grow shrink-0 basis-0 flex-1"
              label=""
              helpText=""
              icon="FeatherSearch"
            >
              <TextField.Input
                className="w-full"
                placeholder="What do you want to read?"
                value={searchQuery}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  // Just update the local state without triggering search
                  setSearchQuery(event.target.value);
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  // Trigger search only when Enter key is pressed
                  if (event.key === "Enter") {
                    setCurrentPage(1); // Reset to first page when search changes
                    // No need to update searchQuery as it's already updated by onChange
                  }
                }}
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
              {essaysLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <div className="flex items-center justify-center p-4">
                      <span>Loading essays...</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : currentEssays.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <div className="flex items-center justify-center p-4">
                      <span>No essays found.</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                currentEssays.map((essay) => (
                  <Table.Row key={essay.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 flex-none rounded-md"
                          style={{
                            background: `linear-gradient(135deg, 
                              hsl(${(essay.title.charCodeAt(0) * 7) % 360}, 80%, 65%), 
                              hsl(${(essay.title.charCodeAt(0) * 7 + 120) % 360}, 70%, 55%))`,
                          }}
                        ></div>
                        <a
                          href={essay.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-[300px] truncate text-body-bold font-body-bold text-default-font hover:text-brand-500 hover:underline"
                          title={essay.title}
                        >
                          {essay.title}
                        </a>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption-bold font-caption-bold text-success-700">
                        {essay.domain_name}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption-bold font-caption-bold text-default-font">
                        {essay.author}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption font-caption text-default-font">
                        {essay.date_published}
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
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <IconButton
                  icon="FeatherChevronLeft"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </div>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum = currentPage;
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum
                            ? "brand-secondary"
                            : "neutral-tertiary"
                        }
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="flex items-center justify-center gap-1">
                <IconButton
                  icon="FeatherChevronRight"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <IconButton
                  icon="FeatherChevronLast"
                  onClick={() => handlePageChange(totalPages)}
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
