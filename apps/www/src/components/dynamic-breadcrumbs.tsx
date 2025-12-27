"use client";

import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mikeour/ui/components/breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SegmentConfig = {
  label?: string;
  href?: string;
  hidden?: boolean;
  mergeWithNext?: boolean;
};

type Crumb = {
  label: string;
  href: string;
  isLast: boolean;
};

type BreadcrumbConfig = Record<
  string,
  SegmentConfig | ((segment: string, nextSegment?: string) => SegmentConfig)
>;

const defaultConfig: BreadcrumbConfig = {
  page: (_segment, next) => ({
    label: next ? `Page ${next}` : "Page",
    mergeWithNext: true,
  }),
};

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DynamicBreadcrumbs({
  config = defaultConfig,
  homeLabel = "Home",
}: {
  config?: BreadcrumbConfig;
  homeLabel?: string;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: Crumb[] = [];

  for (let idx = 0; idx < segments.length; idx++) {
    const segment = segments[idx];
    const nextSegment = segments[idx + 1];
    const path = `/${segments.slice(0, idx + 1).join("/")}`;
    const configEntry = config[segment];

    let label: string;
    let href: string | undefined = path;
    let hidden = false;
    let mergeWithNext = false;

    if (typeof configEntry === "function") {
      const result = configEntry(segment, nextSegment);
      label = result.label ?? formatSegment(segment);
      href = result.href ?? path;
      hidden = result.hidden ?? false;
      mergeWithNext = result.mergeWithNext ?? false;
    } else if (configEntry) {
      label = configEntry.label ?? formatSegment(segment);
      href = configEntry.href ?? path;
      hidden = configEntry.hidden ?? false;
      mergeWithNext = configEntry.mergeWithNext ?? false;
    } else {
      label = formatSegment(segment);
    }

    if (mergeWithNext && nextSegment) {
      idx += 1; // skip next segment
      href = `/${segments.slice(0, idx + 1).join("/")}`;
    }

    if (!hidden) {
      crumbs.push({
        label,
        href,
        isLast: idx === segments.length - 1,
      });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>
            {homeLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
