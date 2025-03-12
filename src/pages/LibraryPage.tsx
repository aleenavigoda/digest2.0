import { IconButton } from "@/ui/components/IconButton";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { Button } from "@/ui/components/Button";
import { Avatar } from "@/ui/components/Avatar";
import { Table } from "@/ui/components/Table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout"; 
import { getBookshelfEssays } from "@/services/socialGraphService";
export default function LibraryPage() {
  const [searchParams] = useSearchParams();
  const bookshelfId = searchParams.get("id") || "default-bookshelf"; // Provide a default ID
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookshelfInfo, setBookshelfInfo] = useState({
    name: "Climate & Care",
    description: "How can we re-write ecologies of care through the lens of indigenous heritage and the earth's natural primitives?",
    essayCount: 35,
    contributorCount: 1,
    imageUrl: "https://res.cloudinary.com/subframe/image/upload/v1723780559/uploads/302/tkyvdicnwbc5ftuyysc0.png"
  });
  
  console.log("LibraryPage rendered with bookshelfId:", bookshelfId);
  
  useEffect(() => {
    async function fetchBookshelfData() {
      try {
        console.log("Fetching essays for bookshelf ID:", bookshelfId);
        const bookshelfEssays = await getBookshelfEssays(bookshelfId);
        console.log("Essays loaded:", bookshelfEssays?.length || 0, "essays");
        if (bookshelfEssays && Array.isArray(bookshelfEssays)) {
          setEssays(bookshelfEssays);
        } else {
          console.error("Invalid essays data received:", bookshelfEssays);
          setEssays([]);
        }
      } catch (error) {
        console.error("Error fetching bookshelf essays:", error);
        setEssays([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookshelfData();
  }, [bookshelfId]);

  return (
    <DefaultPageLayout>
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-8 self-stretch rounded-md bg-neutral-50 px-12 py-12 overflow-auto mobile:h-auto mobile:w-full mobile:rounded-none mobile:border-none mobile:bg-transparent mobile:px-0 mobile:py-0 mobile:shadow-none">
  <div className="flex w-full items-end gap-6 mobile:flex-col mobile:flex-nowrap mobile:items-center mobile:justify-start mobile:gap-6">
    <div className="flex h-40 w-40 flex-none flex-col items-center justify-center gap-2 overflow-hidden rounded-md shadow-lg">
      <img
        className="w-full grow shrink-0 basis-0 object-cover"
        src="https://res.cloudinary.com/subframe/image/upload/v1723780559/uploads/302/tkyvdicnwbc5ftuyysc0.png"
      />
    </div>
    <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 mobile:items-center mobile:justify-start">
      <div className="flex w-full flex-col items-start gap-2 mobile:items-center mobile:justify-start">
        <span className="text-caption-bold font-caption-bold text-default-font">
          RADAR
        </span>
        <span className="w-full text-heading-1 font-heading-1 text-default-font mobile:text-center">
          Climate &amp; Care
        </span>
        <span className="text-body font-body text-default-font mobile:text-center">
          How can we re-write ecologies of care through the lens of indigenous
          heritage and the earth&#39;s natural primitives?
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2" />
        <span className="text-body font-body text-subtext-color">•</span>
        <span className="text-caption font-caption text-subtext-color">
          35 essays
        </span>
        <span className="text-body font-body text-subtext-color">•</span>
        <span className="text-caption font-caption text-subtext-color">
          1 contributor
        </span>
      </div>
    </div>
  </div>
  <div className="flex w-full items-center justify-between">
    <div className="flex items-center gap-4">
      <IconButton
        variant="brand-primary"
        size="large"
        icon="FeatherPlay"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
      />
      <IconButton
        variant="brand-tertiary"
        icon="FeatherShuffle"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
      />
      <IconButton
        variant="brand-tertiary"
        icon="FeatherArrowDownCircle"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
      />
      <SubframeCore.DropdownMenu.Root>
        <SubframeCore.DropdownMenu.Trigger asChild={true}>
          <IconButton
            variant="brand-tertiary"
            icon="FeatherMoreHorizontal"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
      />
      <SubframeCore.DropdownMenu.Root>
        <SubframeCore.DropdownMenu.Trigger asChild={true}>
          <Button
            variant="neutral-tertiary"
            size="small"
            iconRight="FeatherChevronDown"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                Artist
              </DropdownMenu.DropdownItem>
              <DropdownMenu.DropdownItem icon={null}>
                Album
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
    {loading ? (
      <div className="w-full text-center py-8">
        <span className="text-body font-body text-default-font">Loading essays...</span>
      </div>
    ) : essays.length === 0 ? (
      <div className="w-full text-center py-8">
        <span className="text-body font-body text-default-font">No essays found for this bookshelf.</span>
      </div>
    ) : (
      <Table
        header={
          <Table.HeaderRow>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Written by</Table.HeaderCell>
            <Table.HeaderCell>Published on</Table.HeaderCell>
          </Table.HeaderRow>
        }
      >
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Tooltip.Provider>
              <SubframeCore.Tooltip.Root>
                <SubframeCore.Tooltip.Trigger asChild={true}>
                  <SubframeCore.Icon
                    className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
                    name="FeatherGlasses"
                  />
                </SubframeCore.Tooltip.Trigger>
                <SubframeCore.Tooltip.Portal>
                  <SubframeCore.Tooltip.Content
                    side="top"
                    align="start"
                    sideOffset={4}
                    asChild={true}
                  >
                    <div className="flex h-144 w-192 flex-none flex-col items-center rounded-md bg-neutral-50 px-6 py-6 overflow-auto">
                      <div className="flex w-full max-w-[768px] flex-col items-start gap-6">
                        <div className="flex w-full items-center gap-4">
                          <SubframeCore.Icon
                            className="text-body font-body text-neutral-500 w-full flex-none text-center"
                            name="FeatherGlasses"
                          />
                        </div>
                        <div className="flex flex-col items-start gap-4">
                          <span className="text-heading-1 font-heading-1 text-default-font">
                            Essay Details
                          </span>
                          <span className="text-body font-body text-subtext-color">
                            A contemplative exploration of modern creative
                            expression and personal narrative through innovative
                            artistic mediums
                          </span>
                        </div>
                      </div>
                    </div>
                  </SubframeCore.Tooltip.Content>
                </SubframeCore.Tooltip.Portal>
              </SubframeCore.Tooltip.Root>
            </SubframeCore.Tooltip.Provider>
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780655/uploads/302/vacffcy0kwezmeps1tbv.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start px-2 py-2">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                adore u
              </span>
              <span className="line-clamp-2 text-caption font-caption text-default-font">
                A contemplative exploration of modern creative expression and
                personal narrative through innovative artistic mediums
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Fred Again...
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem icon="FeatherUnlock">
                      Share
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherUnlock">
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherUnlock">
                      Add to playlist
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherUnlock">
                      Remove
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </div>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Icon
              className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
              name="FeatherGlasses"
            />
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780683/uploads/302/miu3qrdcodj27aeo9mu9.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                Teenage Birdsong
              </span>
              <span className="text-caption font-caption text-default-font">
                Sixteen Oceans
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Four Tet
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                      Add to playlist
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
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Icon
              className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
              name="FeatherGlasses"
            />
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780611/uploads/302/lbaowphtt6gfvgjr10b4.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                Curls
              </span>
              <span className="text-caption font-caption text-default-font">
                Ribbons
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Bibio
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                      Add to playlist
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
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Icon
              className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
              name="FeatherGlasses"
            />
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780751/uploads/302/cbaa1tfstfnmksus95et.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                Say That
              </span>
              <span className="text-caption font-caption text-default-font">
                Anything in Return
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Toro y Moi
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                      Add to playlist
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
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Icon
              className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
              name="FeatherGlasses"
            />
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780577/uploads/302/hhmv6ey0yajkadnmcp0a.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                We Don&#39;t Wanna Talk
              </span>
              <span className="text-caption font-caption text-default-font">
                Nowhere
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Friday Pilots Club
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                      Add to playlist
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
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Icon
              className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
              name="FeatherGlasses"
            />
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780719/uploads/302/lf4i2zybfw9xxl56w6ce.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                Time (You and I)
              </span>
              <span className="text-caption font-caption text-default-font">
                Mordechai
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Khruangbin
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                      Add to playlist
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
      <Table.Row>
        <Table.Cell className="h-16 grow shrink-0 basis-0">
          <div className="flex grow shrink-0 basis-0 items-center gap-2">
            <SubframeCore.Icon
              className="text-heading-2 font-heading-2 text-subtext-color line-clamp-1 w-8 flex-none text-center"
              name="FeatherGlasses"
            />
            <Avatar
              image="https://res.cloudinary.com/subframe/image/upload/v1723780859/uploads/302/hh4s5xjmsigiehqkb1uh.png"
              square={true}
            >
              A
            </Avatar>
            <div className="flex grow shrink-0 basis-0 flex-col items-start">
              <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                Awake
              </span>
              <span className="text-caption font-caption text-default-font">
                Awake
              </span>
            </div>
          </div>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            Tycho
          </span>
        </Table.Cell>
        <Table.Cell>
          <span className="whitespace-nowrap text-caption font-caption text-neutral-500">
            domain.com
          </span>
        </Table.Cell>
        <Table.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherBookmark"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
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
                    <DropdownMenu.DropdownItem>
                      Favorite
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon="FeatherPlusCircle">
                      Add to playlist
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
    </Table>
    )}
  </div>
</div>
    </DefaultPageLayout>
  );
}
