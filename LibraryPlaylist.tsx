import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { IconButton } from "../ui/components/IconButton";
import { Button } from "../ui/components/Button";
import * as SubframeCore from "@subframe/core";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import { supabase } from "../lib/supabase";
import { Essay } from "../services/essayService";

function LibraryPlaylist() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEssays() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('all_urls')
          .select('id, title, description, domain_name, author, url, date_published')
          .limit(30);

        if (error) {
          throw error;
        }

        if (data) {
          setEssays(data as Essay[]);
        }
      } catch (err) {
        console.error('Error fetching essays:', err);
        setError('Failed to load essays');
      } finally {
        setLoading(false);
      }
    }

    fetchEssays();
  }, []);

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full items-start gap-12 bg-default-background py-12 mobile:flex-col mobile:flex-nowrap mobile:gap-12 mobile:px-6 mobile:py-6">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-8 self-stretch rounded-md bg-neutral-50 px-12 py-12 overflow-auto mobile:h-auto mobile:w-full mobile:flex-none mobile:rounded-none mobile:border-none mobile:bg-transparent mobile:px-0 mobile:py-0 mobile:shadow-none">
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
                  How can we re-write ecologies of care through the lens of
                  indigenous heritage and the earth&#39;s natural primitives?
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2" />
                <span className="text-body font-body text-subtext-color">•</span>
                <span className="text-caption font-caption text-subtext-color">
                  {essays.length} essays
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
                variant="brand-secondary"
                size="large"
                icon="FeatherBookmark"
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
                      <DropdownMenu.DropdownItem icon="FeatherShare2">
                        Share
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherDownload">
                        Download
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownSeparator />
                      <DropdownMenu.DropdownItem icon="FeatherTrash2">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="brand-tertiary"
                icon="FeatherShuffle"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                Shuffle
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex w-full items-center justify-center p-12">
              <span className="text-body font-body text-subtext-color">Loading essays...</span>
            </div>
          ) : error ? (
            <div className="flex w-full items-center justify-center p-12">
              <span className="text-body font-body text-error-500">{error}</span>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-6">
              {essays.map((essay) => (
                <div 
                  key={essay.id}
                  className="flex w-full flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-caption-bold font-caption-bold text-success-700">
                          {essay.domain_name}
                        </span>
                      </div>
                      <a 
                        href={essay.url || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-heading-3 font-heading-3 text-default-font hover:text-brand-500 hover:underline"
                      >
                        {essay.title}
                      </a>
                    </div>
                    <IconButton
                      variant="neutral-tertiary"
                      icon="FeatherBookmark"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation();
                      }}
                    />
                  </div>

                  <div className="line-clamp-2 text-body font-body text-subtext-color">
                    {essay.description || "No description available."}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      {essay.author || "Unknown author"}
                    </span>
                    {essay.date_published && (
                      <>
                        <span className="text-caption font-caption text-subtext-color">•</span>
                        <span className="text-caption font-caption text-subtext-color">
                          {new Date(essay.date_published).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LibraryPlaylist;
