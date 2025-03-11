
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

// Define the type for our URL data
interface UrlData {
  id: number;
  title: string;
  domain_name: string;
  author: string;
  date_published: string;
  image_url?: string;
}

function BookshelfPage() {
  const [urlData, setUrlData] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 7;

  const fetchUrls = async (page: number) => {
    setLoading(true);
    try {
      // Get total count first
      const countResponse = await supabase
        .from('all_urls')
        .select('*', { count: 'exact', head: true });
      
      const totalCount = countResponse.count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / rowsPerPage);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      
      // Use the server-side random function
      const offset = (page - 1) * rowsPerPage;
      const { data, error } = await supabase
        .rpc('get_random_essays', { 
          p_limit: rowsPerPage,
          p_offset: offset
        });

      if (error) {
        console.error('Error fetching URLs:', error);
        console.log('Falling back to standard query with random ordering');
        
        // Fallback to standard query with ORDER BY RANDOM()
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('all_urls')
          .select('*')
          .order('id') // Using simple ordering as fallback
          .limit(rowsPerPage)
          .range(offset, offset + rowsPerPage - 1);
          
        if (fallbackError) {
          console.error('Failed to fetch URLs:', fallbackError);
        } else {
          setUrlData(fallbackData || []);
        }
        
        // Fallback to standard query if the RPC fails for any reason
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('all_urls')
          .select('*')
          .order('id')
          .limit(rowsPerPage)
          .range(offset, offset + rowsPerPage - 1);
          
        if (fallbackError) {
          console.error('Fallback query error:', fallbackError);
        } else {
          setUrlData(fallbackData || []);
        }
      } else {
        setUrlData(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls(currentPage);
  }, [currentPage]);
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Explore our bookshelves
          </span>
          <div className="flex w-full flex-wrap items-start gap-4">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
              <div className="flex w-full items-center gap-4">
                <Avatar
                  size="x-large"
                  image="https://res.cloudinary.com/subframe/image/upload/v1723780835/uploads/302/kr9usrdgbwp9cge3ab1f.png"
                >
                  A
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-brand-700">
                    DIGEST
                  </span>
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    Writing on Writing
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4">
                <span className="text-body font-body text-subtext-color">
                  The best essays from the best essayists on improving your
                  craft, finding your audience, and owning your voice.
                </span>
              </div>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
              <div className="flex w-full items-center gap-4">
                <Avatar
                  size="x-large"
                  image="https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png"
                >
                  A
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-brand-700">
                    RADAR
                  </span>
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    Climate &amp; Care
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4">
                <span className="text-body font-body text-subtext-color">
                  How can we re-write ecologies of care through the lens of
                  indigenous heritage and the earth&#39;s natural primitives?
                </span>
              </div>
            </div>
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
                        <span className="truncate max-w-xs text-body-bold font-body-bold text-default-font" title={url.title}>
                          {url.title}
                        </span>
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which pages to show based on current page
                  let pageNum = i + 1;
                  if (currentPage > 3 && totalPages > 5) {
                    pageNum = Math.min(currentPage - 2 + i, totalPages);
                    if (i === 0 && currentPage > 3) {
                      pageNum = 1; // First page
                    } else if (i === 1 && currentPage > 4) {
                      return (
                        <span key="ellipsis-1" className="px-2">...</span>
                      );
                    } else if (i === 4 && currentPage < totalPages - 2) {
                      return (
                        <span key="ellipsis-2" className="px-2">...</span>
                      );
                    } else if (i === 4) {
                      pageNum = totalPages; // Last page
                    }
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "brand-secondary" : "neutral-tertiary"}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
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
