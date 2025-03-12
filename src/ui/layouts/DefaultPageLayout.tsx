"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/ca2ccb428952/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Avatar — https://app.subframe.com/ca2ccb428952/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Dropdown Menu — https://app.subframe.com/ca2ccb428952/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Text Field — https://app.subframe.com/ca2ccb428952/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 * Sidebar with nested sections and search — https://app.subframe.com/ca2ccb428952/library?component=Sidebar+with+nested+sections+and+search_39907738-bfbe-42db-8142-9d16a0821551
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "../components/Avatar";
import { DropdownMenu } from "../components/DropdownMenu";
import { TextField } from "../components/TextField";
import { SidebarWithNestedSectionsAndSearch } from "../components/SidebarWithNestedSectionsAndSearch";

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
        "flex h-screen w-full items-center",
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
              <TextField.Input placeholder="Find an essay" />
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
          label="Public Lib"
          icon="FeatherLibrarySquare"
        >
          <SidebarWithNestedSectionsAndSearch.NavItem
            selected={true}
            icon="FeatherLibraryBig"
          >
            Public essays
          </SidebarWithNestedSectionsAndSearch.NavItem>
          <SidebarWithNestedSectionsAndSearch.NavSection
            label="Climate & Care"
            icon="FeatherLibrary"
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
