
import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Avatar } from "../ui/components/Avatar";
import { Button } from "../ui/components/Button";
import { TextField } from "../ui/components/TextField";
import { Table } from "../ui/components/Table";
import { IconButton } from "../ui/components/IconButton";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";

interface Bookshelf {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
}

interface Essay {
  id: string;
  title: string;
  domain_name: string;
  author: string;
  url: string;
  date_published: string;
  image_url?: string;
}

// Mock data for bookshelf display
const MOCK_BOOKSHELVES: Bookshelf[] = [
  {
    id: 'shelf-writing',
    name: 'Writing on Writing',
    description: 'The best essays from the best essayists on improving your craft, finding your audience, and owning your voice.',
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
  }
];

// Mock data for essays
const MOCK_ESSAYS: Essay[] = [
  {
    id: '1',
    title: 'I can tolerate anything except the outgroup',
    domain_name: 'Slate Star Codex',
    author: 'Scott Alexander',
    url: 'https://slatestarcodex.com/2014/09/30/i-can-tolerate-anything-except-the-outgroup/',
    date_published: '9/20/14',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780719/uploads/302/lf4i2zybfw9xxl56w6ce.png'
  },
  {
    id: '2',
    title: 'Information Asymmetry is Power',
    domain_name: 'chrisgillett.org',
    author: 'Chris Gillett',
    url: 'https://chrisgillett.org/information-asymmetry',
    date_published: '9/2/22',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780655/uploads/302/vacffcy0kwezmeps1tbv.png'
  },
  {
    id: '3',
    title: 'On DeepSeek and Export Controls',
    domain_name: 'darioamodei.com',
    author: 'Dario Amodei',
    url: 'https://darioamodei.com/deepseek',
    date_published: '1/28/25',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780751/uploads/302/cbaa1tfstfnmksus95et.png'
  },
  {
    id: '4',
    title: '28 Millenia Later',
    domain_name: 'qntm.org',
    author: 'qntm',
    url: 'https://qntm.org/millenia',
    date_published: '11/13/20',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780624/uploads/302/sxocuez05safdpfaztiz.png'
  },
  {
    id: '5',
    title: 'The necessity of Nussbaum',
    domain_name: 'Aeon',
    author: 'Brandon Robshaw',
    url: 'https://aeon.co/essays/the-necessity-of-nussbaum',
    date_published: '3/7/25',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780871/uploads/302/h25wathcuwiid5ulpu1i.png'
  },
  {
    id: '6',
    title: 'Automating Reality',
    domain_name: 'ZORA ZINE',
    author: 'Matthew Donovan',
    url: 'https://zora.co/zine/automating-reality',
    date_published: '12/29/23',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780853/uploads/302/h3glkflohcjajdl3lah6.png'
  },
  {
    id: '7',
    title: 'Compute in America: Building the Next Gen..',
    domain_name: 'IFP',
    author: 'Tim Fist',
    url: 'https://ifp.org/compute-in-america',
    date_published: '6/10/24',
    image_url: 'https://res.cloudinary.com/subframe/image/upload/v1723780696/uploads/302/hxk01sckxtlsjxi4n2dv.png'
  }
];

export default function BookshelfPage() {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simply use the mock data directly
    setBookshelves(MOCK_BOOKSHELVES);
    setEssays(MOCK_ESSAYS);
    setLoading(false);
  }, []);

  return (
    <DefaultPageLayout>
      <div className="flex h-full flex-col items-start gap-6 p-10">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-heading-1 font-heading-1 text-default-font">
                Explore our bookshelves
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

        {/* Browse all essays section */}
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
              {essays.map((essay) => (
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
