"use client";
/*
 * Documentation:
 * Sidebar with nested sections and search — https://app.subframe.com/ca2ccb428952/library?component=Sidebar+with+nested+sections+and+search_39907738-bfbe-42db-8142-9d16a0821551
 * Avatar — https://app.subframe.com/ca2ccb428952/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Dropdown Menu — https://app.subframe.com/ca2ccb428952/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Icon Button — https://app.subframe.com/ca2ccb428952/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Text Field — https://app.subframe.com/ca2ccb428952/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { DropdownMenu } from "./DropdownMenu";
import { Accordion } from "./Accordion";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children?: React.ReactNode;
  icon?: SubframeCore.IconName;
  rightSlot?: React.ReactNode;
  className?: string;
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  {
    selected = false,
    children,
    icon = "FeatherCircleDashed",
    rightSlot,
    className,
    ...otherProps
  }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "group/24343c20 flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-3 py-1 hover:bg-neutral-50 active:bg-neutral-100",
        {
          "bg-neutral-100 hover:bg-neutral-100 active:bg-neutral-200": selected,
        },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SubframeCore.Icon
        className={SubframeCore.twClassNames(
          "text-body font-body text-subtext-color",
          { "text-default-font": selected }
        )}
        name={icon}
      />
      {children ? (
        <span
          className={SubframeCore.twClassNames(
            "line-clamp-1 grow shrink-0 basis-0 text-caption-bold font-caption-bold text-subtext-color",
            {
              "text-caption-bold font-caption-bold text-default-font": selected,
            }
          )}
        >
          {children}
        </span>
      ) : null}
      {rightSlot ? <div className="flex items-center">{rightSlot}</div> : null}
    </div>
  );
});

interface NavSectionProps extends React.ComponentProps<typeof Accordion> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: SubframeCore.IconName;
  rightSlot?: React.ReactNode;
  className?: string;
}

const NavSection = React.forwardRef<HTMLElement, NavSectionProps>(
  function NavSection(
    {
      children,
      label,
      icon = null,
      rightSlot,
      className,
      ...otherProps
    }: NavSectionProps,
    ref
  ) {
    return (
      <Accordion
        className={SubframeCore.twClassNames(
          "group/19b3e897 cursor-pointer",
          className
        )}
        trigger={
          <div className="flex h-8 w-full flex-none items-center gap-2 rounded-md pl-3 pr-2 py-1 group-hover/19b3e897:bg-neutral-50">
            <Accordion.Chevron />
            {label ? (
              <span className="line-clamp-1 grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
                {label}
              </span>
            ) : null}
            {rightSlot ? (
              <div className="flex items-center">{rightSlot}</div>
            ) : null}
          </div>
        }
        defaultOpen={true}
        ref={ref as any}
        {...otherProps}
      >
        {children ? (
          <div className="flex w-full flex-col items-start pl-6">
            {children}
          </div>
        ) : null}
      </Accordion>
    );
  }
);

interface SidebarWithNestedSectionsAndSearchRootProps
  extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const SidebarWithNestedSectionsAndSearchRoot = React.forwardRef<
  HTMLElement,
  SidebarWithNestedSectionsAndSearchRootProps
>(function SidebarWithNestedSectionsAndSearchRoot(
  {
    header,
    footer,
    children,
    className,
    ...otherProps
  }: SidebarWithNestedSectionsAndSearchRootProps,
  ref
) {
  return (
    <nav
      className={SubframeCore.twClassNames(
        "flex h-full w-60 flex-col items-start border-r border-solid border-neutral-border bg-default-background",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {header ? (
        <div className="flex w-full flex-col items-center gap-4 px-4 py-4">
          {header}
        </div>
      ) : null}
      {children ? (
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start px-2 py-2 overflow-auto">
          {children}
        </div>
      ) : null}
      {footer ? (
        <div className="flex w-full flex-col items-center px-4 py-4">
          {footer}
        </div>
      ) : null}
    </nav>
  );
});

export const SidebarWithNestedSectionsAndSearch = Object.assign(
  SidebarWithNestedSectionsAndSearchRoot,
  {
    NavItem,
    NavSection,
  }
);
"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "./Avatar";
import { DropdownMenu } from "./DropdownMenu";
import { TextField } from "./TextField";
import { IconButton } from "./IconButton";

export const SidebarWithNestedSectionsAndSearch = ({
  className,
  header,
  ...props
}) => {
  return (
    <div className={`flex flex-col h-full border-r border-neutral-border ${className}`} {...props}>
      <div className="border-b border-neutral-border p-4">
        {header}
      </div>
      <div className="p-4">
        <TextField className="w-full" icon="FeatherSearch">
          <TextField.Input placeholder="Search..." />
        </TextField>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <div className="py-2">
            <div className="px-3 mb-2 text-xs font-medium text-muted-color uppercase tracking-wider">
              Browse
            </div>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-brand-50 text-brand-700">
              <SubframeCore.Icon.FeatherHome className="mr-3 h-5 w-5" />
              Home
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-default-font hover:bg-neutral-hover">
              <SubframeCore.Icon.FeatherBookOpen className="mr-3 h-5 w-5" />
              Bookshelves
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-default-font hover:bg-neutral-hover">
              <SubframeCore.Icon.FeatherStar className="mr-3 h-5 w-5" />
              Favorites
            </a>
          </div>
          <div className="py-2">
            <div className="px-3 mb-2 text-xs font-medium text-muted-color uppercase tracking-wider">
              Collections
            </div>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-default-font hover:bg-neutral-hover">
              <SubframeCore.Icon.FeatherFolder className="mr-3 h-5 w-5" />
              Science
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-default-font hover:bg-neutral-hover">
              <SubframeCore.Icon.FeatherFolder className="mr-3 h-5 w-5" />
              Philosophy
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-default-font hover:bg-neutral-hover">
              <SubframeCore.Icon.FeatherFolder className="mr-3 h-5 w-5" />
              History
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};
