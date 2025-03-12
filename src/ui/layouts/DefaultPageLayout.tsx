"use client";
/*
 * Documentation:
 * Sidebar with icons — https://app.subframe.com/ca2ccb428952/library?component=Sidebar+with+icons_8f42a4a0-e731-4e79-8e60-af56db87fb5b
 * Sidebar with sections — https://app.subframe.com/ca2ccb428952/library?component=Sidebar+with+sections_f4047c8b-cfb4-4761-b9cf-fbcae8a9b9b5
 * Avatar — https://app.subframe.com/ca2ccb428952/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Dropdown Menu — https://app.subframe.com/ca2ccb428952/library?component=Dropdown+Menu_3aac6e9a-5ac5-487b-a0da-10b0fa0a4f05
 * Text Field — https://app.subframe.com/ca2ccb428952/library?component=Text+Field_afa33b0e-7ae7-4b1c-bc79-5a0fa234b34e
 * Icon Button — https://app.subframe.com/ca2ccb428952/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { SidebarRailWithIcons } from "../components/SidebarRailWithIcons";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { DropdownMenu } from "../components/DropdownMenu";
import { TextField } from "../components/TextField";
import { SidebarWithNestedSectionsAndSearch } from "../components/SidebarWithNestedSectionsAndSearch";
import { IconButton } from "../components/IconButton";
import SubframeLogo from "./subframe-logo.svg?react";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex h-screen w-full items-start",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SidebarWithNestedSectionsAndSearch
        className="mobile:hidden"
        header={
          <>
            <div className="flex w-full items-center justify-between pl-1 py-1">
              <SubframeCore.DropdownMenu.Root>
                <SubframeCore.DropdownMenu.Trigger asChild={true}>
                  <div className="flex grow shrink-0 basis-0 items-center gap-2">
                    <Avatar
                      size="small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1741746214/uploads/7262/omdisrk7gzxrwymwkdzm.png"
                    >
                      A
                    </Avatar>
                    <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                      Digest
                    </span>
                  </div>
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
                        Invite team members
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon={null}>
                        Settings
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon={null}>
                        Sign out
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </div>
            <TextField
              className="h-auto w-full flex-none"
              variant="filled"
              label=""
              helpText=""
              icon="FeatherSearch"
            >
              <TextField.Input
                placeholder="Find an essay"
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
              />
            </TextField>
          </>
        }
      >
        <SidebarWithNestedSectionsAndSearch.NavItem
          selected={true}
          icon="FeatherHome"
        >
          Home
        </SidebarWithNestedSectionsAndSearch.NavItem>
        <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherLibrary">
          Bookshelves
        </SidebarWithNestedSectionsAndSearch.NavItem>
        <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherBookText">
          Readlist
        </SidebarWithNestedSectionsAndSearch.NavItem>
        <SidebarWithNestedSectionsAndSearch.NavSection
          label="Library"
          icon="FeatherLibrarySquare"
          rightSlot={
            <IconButton
              size="small"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            />
          }
        >
          <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherLibraryBig">
            Public essays
          </SidebarWithNestedSectionsAndSearch.NavItem>
          <SidebarWithNestedSectionsAndSearch.NavSection
            label="Climate & Care"
            icon="FeatherLibrary"
            rightSlot={
              <IconButton
                size="small"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            }
          >
            <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherFileText">
              Bookshelf Essay 1
            </SidebarWithNestedSectionsAndSearch.NavItem>
            <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherFileText">
              Bookshelf Essay 2
            </SidebarWithNestedSectionsAndSearch.NavItem>
            <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherFileText">
              Bookshelf Essay 3
            </SidebarWithNestedSectionsAndSearch.NavItem>
          </SidebarWithNestedSectionsAndSearch.NavSection>
          <SidebarWithNestedSectionsAndSearch.NavSection
            label="Substack & Chill"
            icon="FeatherLibrary"
            rightSlot={
              <IconButton
                size="small"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            }
          >
            <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherFileText">
              Bookshelf Essay 4
            </SidebarWithNestedSectionsAndSearch.NavItem>
            <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherFileText">
              Bookshelf Essay 5
            </SidebarWithNestedSectionsAndSearch.NavItem>
            <SidebarWithNestedSectionsAndSearch.NavItem icon="FeatherFileText">
              Bookshelf Essay 6
            </SidebarWithNestedSectionsAndSearch.NavItem>
          </SidebarWithNestedSectionsAndSearch.NavSection>
        </SidebarWithNestedSectionsAndSearch.NavSection>
      </SidebarWithNestedSectionsAndSearch>
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;