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
import { IconButton } from "../components/IconButton";
import { Avatar } from "../components/Avatar";
import { DropdownMenu } from "../components/DropdownMenu";
import { SidebarWithNestedSectionsAndSearch } from "../components/SidebarWithNestedSectionsAndSearch";


interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef(
  function DefaultPageLayoutRoot(
    { children, className, ...otherProps }: DefaultPageLayoutRootProps,
    ref: React.Ref<HTMLDivElement>
  ) {
    return (
      <div
        ref={ref}
        className={`flex h-full w-full flex-col overflow-hidden ${className || ""}`}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
);

interface DefaultPageLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function DefaultPageLayout({
  children,
  className,
}: DefaultPageLayoutProps) {
  return (
    <DefaultPageLayoutRoot className={className}>
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <SidebarWithNestedSectionsAndSearch
          className="mobile:hidden w-64"
          header={
            <>
              <div className="flex w-full items-center justify-between pl-1 py-1">
                <SubframeCore.DropdownMenu.Root>
                  <SubframeCore.DropdownMenu.Trigger asChild={true}>
                    <div className="flex grow shrink-0 basis-0 items-center gap-2 cursor-pointer">
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
                          Account settings
                        </DropdownMenu.DropdownItem>
                        <DropdownMenu.DropdownItem icon={null}>
                          Logout
                        </DropdownMenu.DropdownItem>
                      </DropdownMenu>
                    </SubframeCore.DropdownMenu.Content>
                  </SubframeCore.DropdownMenu.Portal>
                </SubframeCore.DropdownMenu.Root>
                <IconButton
                  icon="FeatherMenu"
                  iconClassName="text-default-font"
                  variant="neutral-ghost"
                  size="small"
                />
              </div>
            </>
          }
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </DefaultPageLayoutRoot>
  );
}