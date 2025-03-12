
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { IconButton } from "../ui/components/IconButton";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { Button } from "../ui/components/Button";
import { Avatar } from "../ui/components/Avatar";
import { Table } from "../ui/components/Table";
import { getBookshelfEssays, Essay } from "../services/socialGraphService";
import { getPublicBookshelves, Bookshelf } from "../services/bookshelfService";

function LibraryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookshelf, setBookshelf] = useState<Bookshelf | null>(null);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);

  // Color palettes for distinct bookshelf gradients
  const colorPalettes = [
    ['#FF5F6D', '#FFC371'], // Warm sunset
    ['#2193b0', '#6dd5ed'], // Cool blue
    ['#834d9b', '#d04ed6'], // Purple fusion
    ['#4e54c8', '#8f94fb'], // Mystic blues
    ['#11998e', '#38ef7d'], // Green meadow
    ['#FC466B', '#3F5EFB'], // Pink to blue
    ['#00F260', '#0575E6'], // Green to blue
    ['#e1eec3', '#f05053'], // Soft green to red
    ['#8A2387', '#F27121'], // Purple to orange
    ['#1A2980', '#26D0CE'], // Dark blue to teal
  ];

  useEffect(() => {
    const fetchBookshelfData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch bookshelf details
        const bookshelves = await getPublicBookshelves();
        const currentBookshelf = bookshelves.find(shelf => shelf.id === id);
        
        if (currentBookshelf) {
          setBookshelf(currentBookshelf);
          
          // Fetch essays in the bookshelf
          try {
            const bookshelfEssays = await getBookshelfEssays(id);
            setEssays(bookshelfEssays);
          } catch (error) {
            console.error("Error fetching bookshelf essays:", error);
            // Fallback to empty array if fetching essays fails
            setEssays([]);
          }
        } else {
          console.error("Bookshelf not found");
          // You might want to navigate to a 404 page or back to the bookshelves list
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching bookshelf data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookshelfData();
  }, [id, navigate]);

  if (loading) {
    return (
      <DefaultPageLayout>
        <div className="container flex h-full w-full items-center justify-center">
          <span>Loading bookshelf...</span>
        </div>
      </DefaultPageLayout>
    );
  }

  if (!bookshelf) {
    return (
      <DefaultPageLayout>
        <div className="container flex h-full w-full items-center justify-center">
          <span>Bookshelf not found</span>
        </div>
      </DefaultPageLayout>
    );
  }

  // Get color palette for this bookshelf based on its id
  const colorIndex = parseInt(bookshelf.id.replace(/\D/g, '')) % colorPalettes.length || 0;
  const gradientColors = colorPalettes[colorIndex];

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full items-start gap-12 bg-default-background py-12 mobile:flex-col mobile:flex-nowrap mobile:gap-12 mobile:px-6 mobile:py-6">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-8 self-stretch rounded-md bg-neutral-50 px-12 py-12 overflow-auto mobile:h-auto mobile:w-full mobile:flex-none mobile:rounded-none mobile:border-none mobile:bg-transparent mobile:px-0 mobile:py-0 mobile:shadow-none">
          <div className="flex w-full items-end gap-6 mobile:flex-col mobile:flex-nowrap mobile:items-center mobile:justify-start mobile:gap-6">
            <div 
              className="flex h-40 w-40 flex-none flex-col items-center justify-center gap-2 overflow-hidden rounded-md shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
              }}
            >
              {bookshelf.image_url ? (
                <img
                  className="w-full grow shrink-0 basis-0 object-cover"
                  src={bookshelf.image_url}
                  alt={bookshelf.name}
                />
              ) : (
                <span className="text-heading-1 font-heading-1 text-white">
                  {bookshelf.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 mobile:items-center mobile:justify-start">
              <div className="flex w-full flex-col items-start gap-2 mobile:items-center mobile:justify-start">
                <span className="text-caption-bold font-caption-bold text-default-font">
                  {bookshelf.core_curator || "DIGEST"}
                </span>
                <span className="w-full text-heading-1 font-heading-1 text-default-font mobile:text-center">
                  {bookshelf.name}
                </span>
                <span className="text-body font-body text-default-font mobile:text-center">
                  {bookshelf.description}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2" />
                <span className="text-body font-body text-subtext-color">
                  •
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  {essays.length} essays
                </span>
                <span className="text-body font-body text-subtext-color">
                  •
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  Public
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <IconButton
                variant="brand-primary"
                size="large"
                icon="FeatherArrowLeft"
                onClick={() => navigate("/")}
              />
              <IconButton
                variant="brand-tertiary"
                icon="FeatherShare"
                onClick={() => {}}
              />
              <IconButton
                variant="brand-tertiary"
                icon="FeatherBookmark"
                onClick={() => {}}
              />
              <SubframeCore.DropdownMenu.Root>
                <SubframeCore.DropdownMenu.Trigger asChild={true}>
                  <IconButton
                    variant="brand-tertiary"
                    icon="FeatherMoreHorizontal"
                    onClick={() => {}}
                  />
                </SubframeCore.DropdownMenu.Trigger>
                <SubframeCore.DropdownMenu.Portal>
                  <SubframeCore.DropdownMenu.Content
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    asChild={true}
                  >
                    <DropdownMenu>
                      <DropdownMenu.DropdownItem icon="FeatherShare">
                        Share
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherEdit2">
                        Rename
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                size="small"
                icon="FeatherSearch"
                onClick={() => {}}
              />
              <SubframeCore.DropdownMenu.Root>
                <SubframeCore.DropdownMenu.Trigger asChild={true}>
                  <Button
                    variant="neutral-tertiary"
                    size="small"
                    iconRight="FeatherChevronDown"
                    onClick={() => {}}
                  >
                    Sort
                  </Button>
                </SubframeCore.DropdownMenu.Trigger>
                <SubframeCore.DropdownMenu.Portal>
                  <SubframeCore.DropdownMenu.Content
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    asChild={true}
                  >
                    <DropdownMenu>
                      <DropdownMenu.DropdownItem icon={null}>
                        Title
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon={null}>
                        Author
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon={null}>
                        Publication
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon={null}>
                        Date added
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-8 overflow-auto">
            <Table
              header={
                <Table.HeaderRow>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Written by</Table.HeaderCell>
                  <Table.HeaderCell>Published on</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.HeaderRow>
              }
            >
              {essays.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <div className="flex items-center justify-center p-4">
                      <span>No essays found in this bookshelf.</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                essays.map((essay, index) => (
                  <Table.Row key={essay.id || index}>
                    <Table.Cell className="h-16 grow shrink-0 basis-0">
                      <div className="flex grow shrink-0 basis-0 items-center gap-2">
                        <SubframeCore.Icon
                          className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
                          name="FeatherGlasses"
                        />
                        <Avatar
                          square={true}
                          style={{
                            background: `linear-gradient(135deg, 
                              ${colorPalettes[essay.title.charCodeAt(0) % colorPalettes.length][0]}, 
                              ${colorPalettes[essay.title.charCodeAt(0) % colorPalettes.length][1]})`,
                          }}
                        >
                          {essay.title.charAt(0)}
                        </Avatar>
                        <div className="flex grow shrink-0 basis-0 flex-col items-start px-2 py-2">
                          <a
                            href={essay.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap text-body-bold font-body-bold text-default-font hover:text-brand-500 hover:underline"
                          >
                            {essay.title}
                          </a>
                          <span className="line-clamp-2 text-caption font-caption text-default-font">
                            {/* Description would go here if available */}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
                        {essay.author}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
                        {essay.domain_name}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex grow shrink-0 basis-0 items-center justify-end">
                        <SubframeCore.DropdownMenu.Root>
                          <SubframeCore.DropdownMenu.Trigger asChild={true}>
                            <IconButton
                              icon="FeatherBookmark"
                              onClick={() => {}}
                            />
                          </SubframeCore.DropdownMenu.Trigger>
                          <SubframeCore.DropdownMenu.Portal>
                            <SubframeCore.DropdownMenu.Content
                              side="bottom"
                              align="end"
                              sideOffset={8}
                              asChild={true}
                            >
                              <DropdownMenu>
                                <DropdownMenu.DropdownItem icon="FeatherShare">
                                  Share
                                </DropdownMenu.DropdownItem>
                                <DropdownMenu.DropdownItem icon="FeatherHeart">
                                  Favorite
                                </DropdownMenu.DropdownItem>
                                <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                                  Add to bookshelf
                                </DropdownMenu.DropdownItem>
                                <DropdownMenu.DropdownItem icon="FeatherMinusCircle">
                                  Remove
                                </DropdownMenu.DropdownItem>
                              </DropdownMenu>
                            </SubframeCore.DropdownMenu.Content>
                          </SubframeCore.DropdownMenu.Portal>
                        </SubframeCore.DropdownMenu.Root>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LibraryPage;
