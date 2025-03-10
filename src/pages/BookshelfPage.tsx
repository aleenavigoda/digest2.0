"use client";

import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Avatar } from "@/ui/components/Avatar";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Table } from "@/ui/components/Table";
import { IconButton } from "@/ui/components/IconButton";
import { urlService, Url } from "@/services/urlService";

function BookshelfPage() {
  // URL state
  const [urls, setUrls] = useState<Url[]>([]);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Fetch URLs on component mount
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setUrlsLoading(true);
        const data = await urlService.getUrls();
        setUrls(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setUrlsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  // Handle editing URL
  const handleEditUrl = (id: string) => {
    console.log('Edit URL with ID:', id);
    // Add edit functionality here
  };

  // Handle deleting URL
  const handleDeleteUrl = (id: string) => {
    console.log('Delete URL with ID:', id);
    // Add delete functionality here
  };

  // Get paginated URLs
  const getPaginatedUrls = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return urls.slice(startIndex, endIndex);
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Explore our bookshelves
          </span>

          {loading ? (
            <div className="w-full text-center py-8">Loading books...</div>
          ) : (
            <div className="flex w-full flex-wrap items-start gap-4">
              {books.map((book) => (
                <div key={book.id} className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
                  <div className="flex w-full items-center gap-4">
                    <Avatar
                      size="x-large"
                      image={book.cover_image || "https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png"}
                    >
                      {book.title.charAt(0)}
                    </Avatar>
                    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                      <span className="text-caption-bold font-caption-bold text-brand-700">
                        {book.category || "BOOK"}
                      </span>
                      <span className="text-heading-3 font-heading-3 text-default-font">
                        {book.title}
                      </span>
                      <span className="text-body font-body text-default-font">
                        by {book.author}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-body font-body text-default-font">
                      {book.description || "No description available."}
                    </p>
                  </div>
                </div>
              ))}

              {books.length === 0 && !loading && (
                <div className="w-full text-center py-8">
                  No books found. Add some books to your collection!
                </div>
              )}
            </div>
          )}
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
                      Trending
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            <Button
              variant="neutral-secondary"
              icon="FeatherCalendar"
              iconRight="FeatherChevronDown"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              This month
            </Button>
            <Button
              variant="neutral-secondary"
              icon="FeatherClipboard"
              iconRight="FeatherChevronDown"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              All types
            </Button>
          </div>
          {urlsLoading ? (
            <div className="w-full text-center py-8">Loading URLs...</div>
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell variant="head" className="w-1/3">
                    Title
                  </Table.Cell>
                  <Table.Cell variant="head" className="w-1/5">
                    Published on
                  </Table.Cell>
                  <Table.Cell variant="head" className="w-1/5">
                    Written by
                  </Table.Cell>
                  <Table.Cell variant="head" className="w-1/5">
                    Date
                  </Table.Cell>
                  <Table.Cell variant="head" className="w-30">
                    <span className="sr-only">Actions</span>
                  </Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {getPaginatedUrls().length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      No URLs found. Add some URLs to your collection!
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  getPaginatedUrls().map((url) => (
                    <Table.Row key={url.id}>
                      <Table.Cell>{url.title}</Table.Cell>
                      <Table.Cell>{url.domain_name}</Table.Cell>
                      <Table.Cell>{url.author}</Table.Cell>
                      <Table.Cell>
                        {new Date(url.date_published).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            variant="neutral-secondary"
                            icon="FeatherEdit"
                            aria-label="Edit essay"
                            onClick={() => handleEditUrl(url.id)}
                          />
                          <IconButton
                            variant="neutral-secondary"
                            icon="FeatherTrash"
                            aria-label="Delete essay"
                            onClick={() => handleDeleteUrl(url.id)}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
              <Table.Pagination>
                <Table.PaginationContent>
                  <Table.PaginationItem
                    icon="FeatherChevronsLeft"
                    aria-label="Go to first page"
                    onClick={() => setCurrentPage(1)}
                  />
                  <Table.PaginationItem
                    icon="FeatherChevronLeft"
                    aria-label="Go to previous page"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Table.PaginationItem
                      key={page}
                      page={page}
                      onClick={() => setCurrentPage(page)}
                      isActive={page === currentPage}
                    />
                  ))}
                  <Table.PaginationItem
                    icon="FeatherChevronRight"
                    aria-label="Go to next page"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  />
                  <Table.PaginationItem
                    icon="FeatherChevronsRight"
                    aria-label="Go to last page"
                    onClick={() => setCurrentPage(totalPages)}
                  />
                </Table.PaginationContent>
              </Table.Pagination>
            </Table>
          )}
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default BookshelfPage;