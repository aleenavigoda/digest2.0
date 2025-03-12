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
import { Avatar } from "./Avatar";
import { DropdownMenu } from "./DropdownMenu";
import { TextField } from "./TextField";
import { IconButton } from "./IconButton";

interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  href?: string;
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  function NavItem(
    { isActive, icon, children, className, ...otherProps }: NavItemProps,
    ref
  ) {
    return (
      <a
        className={SubframeCore.twClassNames(
          "flex h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-body font-body",
          isActive
            ? "bg-neutral-hover text-default-font"
            : "text-subtext-color hover:bg-neutral-hover hover:text-default-font",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {icon ? (
          <div className="flex h-4 w-4 items-center justify-center text-inherit">
            {icon}
          </div>
        ) : null}
        <span className="grow shrink-0 basis-0 text-inherit">{children}</span>
        {isActive ? (
          <div className="h-full w-0.5 rounded-full bg-neutral-hover"></div>
        ) : null}
      </a>
    );
  }
);

interface NavSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const NavSection = React.forwardRef<HTMLElement, NavSectionProps>(
  function NavSection(
    { title, children, className, ...otherProps }: NavSectionProps,
    ref
  ) {
    return (
      <section
        className={SubframeCore.twClassNames(
          "flex w-full flex-col items-start gap-1",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {title ? (
          <span className="px-3 text-overline font-overline uppercase tracking-wider text-muted-color">
            {title}
          </span>
        ) : null}
        <div className="flex w-full flex-col items-start">{children}</div>
      </section>
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