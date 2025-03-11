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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bookshelves from Neo4j
  useEffect(() => {
    const fetchBookshelves = async () => {
      try {
        setBookshelvesLoading(true);
        const data = await getPublicBookshelves();
        setBookshelves(data);
      } catch (error) {
        console.error('Error fetching bookshelves:', error);
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
        const data = await getAllEssays();
        if (data && data.length > 0) {
          console.log('Successfully loaded essays:', data.length);
          setEssays(data);
        } else {
          console.warn('No essays data returned, using mock data');
          // If we get here, we're likely using mock data
          setEssays(data); // Still set the data (which is likely MOCK_ESSAYS)
        }
      } catch (error) {
        console.error('Error fetching essays:', error);
      } finally {
        setEssaysLoading(false);
      }
    };

    fetchEssays();
  }, []);

  // Filter essays based on search query
  const filteredEssays = essays.filter(essay => 
    searchQuery === "" || 
    essay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    essay.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    essay.domain_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate essays
  const indexOfLastEssay = currentPage * itemsPerPage;
  const indexOfFirstEssay = indexOfLastEssay - itemsPerPage;
  const currentEssays = filteredEssays.slice(indexOfFirstEssay, indexOfLastEssay);
  const totalPages = Math.ceil(filteredEssays.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Explore our bookshelves
          </span>
          <div className="flex w-full flex-wrap items-start gap-4">
            {bookshelvesLoading ? (
              <div className="flex items-center justify-center p-8 w-full">
                <span>Loading bookshelves...</span>
              </div>
            ) : bookshelves.length === 0 ? (
              <div className="flex items-center justify-center p-8 w-full">
                <span>No bookshelves found.</span>
              </div>
            ) : (
              bookshelves.map((shelf, index) => (
                <div key={shelf.id} className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
                  <div className="flex w-full items-center gap-4">
                    <Avatar
                      size="x-large"
                      image={shelf.image_url || ""}
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
                      All domains
                    </DropdownMenu.DropdownItem>
                    {Array.from(new Set(essays.map(essay => essay.domain_name))).map(domain => (
                      <DropdownMenu.DropdownItem key={domain} icon={null}>
                        {domain}
                      </DropdownMenu.DropdownItem>
                    ))}
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
                value={searchQuery}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
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
                        <img
                          className="h-6 w-6 flex-none rounded-md object-cover"
                          src={essay.image_url}
                          alt={essay.title}
                        />
                        <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                          {essay.title}
                        </span>
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
                        variant={currentPage === pageNum ? "brand-secondary" : "neutral-tertiary"}
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