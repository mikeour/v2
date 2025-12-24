"use client";

import type { TrackData } from "@mikeour/integrations/spotify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mikeour/ui/components/table";
import { cn } from "@mikeour/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type MusicTableProps = {
  data: TrackData[];
  columns: ColumnDef<TrackData>[];
  currentPageNumber: number;
};

const songsPerPage = 10;

export function MusicTable({
  data,
  columns,
  currentPageNumber,
}: MusicTableProps) {
  const totalPages = Math.ceil(data.length / songsPerPage);
  const numberOfTracksToSkip = (currentPageNumber - 1) * songsPerPage;

  const currentTracks = data.slice(
    numberOfTracksToSkip,
    numberOfTracksToSkip + songsPerPage
  );

  const table = useReactTable({
    data: currentTracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: { currentPageNumber },
  });

  if (currentPageNumber > totalPages || currentPageNumber <= 0) {
    return notFound();
  }

  return (
    <div className="scroll-m-50">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const shouldHide = header.index === 1 || header.index === 2;
                return (
                  <TableHead
                    className={cn(
                      !!shouldHide && "hidden lg:table-cell",
                      header.index === 0 && "lg:w-[55%]",
                      header.index === 1 && "lg:w-[30%]",
                      header.index === 2 && "lg:w-[10%]",
                      header.index === 3 && "lg:w-[5%]"
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const shouldHide =
                  cell.column.id === "album" || cell.column.id === "duration";

                return (
                  <TableCell
                    className={cn(
                      !!shouldHide && "hidden lg:table-cell",
                      cell.column.id === "title" && "pr-5",
                      cell.column.id === "album" && "pr-5",
                      cell.column.id === "duration" && "text-center"
                    )}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mb-4 flex items-center justify-between gap-8 py-4 lg:justify-end">
        <span className="text-gray-400">
          Page {currentPageNumber} of {totalPages}
        </span>
        <div className="flex items-center space-x-2">
          <StyledLink
            disabled={currentPageNumber === 1}
            href={{
              pathname: "/music",
            }}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </StyledLink>
          <StyledLink
            disabled={currentPageNumber === 1}
            href={{
              pathname: `/music/page/${currentPageNumber - 1}`,
            }}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </StyledLink>
          <StyledLink
            disabled={currentPageNumber + 1 > totalPages}
            href={{
              pathname: `/music/page/${currentPageNumber + 1}`,
            }}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </StyledLink>
          <StyledLink
            disabled={currentPageNumber + 1 > totalPages}
            href={{
              pathname: `/music/page/${totalPages}`,
            }}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </StyledLink>
        </div>
      </div>
    </div>
  );
}

function StyledLink({
  children,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  disabled: boolean;
} & React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "rounded border border-input bg-background p-1 text-white no-underline transition-colors hover:bg-accent hover:text-accent-foreground",
        !!disabled && "pointer-events-none cursor-not-allowed text-gray-500"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
