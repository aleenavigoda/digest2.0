"use client";

import React, { useEffect, useState } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Avatar } from "@/ui/components/Avatar";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { Table } from "@/ui/components/Table";
import { IconButton } from "@/ui/components/IconButton";
import { bookService, Book } from "../services/bookService";

function BookshelfPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background py-12">
        <div className="flex w-full flex-col items-start gap-6">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Explore our bookshelves
          </span>

          {error && (
            <div className="w-full p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

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
              {books.map((book) => (
                <Table.Row key={book.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <img
                        className="h-6 w-6 flex-none rounded-md object-cover"
                        src={book.cover_image || "https://res.cloudinary.com/subframe/image/upload/v1723780719/uploads/302/lf4i2zybfw9xxl56w6ce.png"}
                      />
                      <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                        {book.title}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-caption-bold font-caption-bold text-success-700">
                      {book.publisher}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-caption-bold font-caption-bold text-default-font">
                      {book.author}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap text-caption font-caption text-default-font">
                      {book.published_date}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
            <div className="flex w-full items-center justify-center gap-1 px-4 py-4">
              <div className="flex items-center justify-center gap-1">
                <IconButton
                  icon="FeatherChevronFirst"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
                <IconButton
                  icon="FeatherChevronLeft"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </div>
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="brand-secondary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  1
                </Button>
                <Button
                  variant="neutral-tertiary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  2
                </Button>
                <Button
                  variant="neutral-tertiary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  3
                </Button>
                <Button
                  variant="neutral-tertiary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  4
                </Button>
                <Button
                  variant="neutral-tertiary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  5
                </Button>
              </div>
              <div className="flex items-center justify-center gap-1">
                <IconButton
                  icon="FeatherChevronRight"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
                <IconButton
                  icon="FeatherChevronLast"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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