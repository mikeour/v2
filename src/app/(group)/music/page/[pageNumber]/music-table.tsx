"use client";

import { ComponentProps } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ColumnDef,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { TrackData } from "~/lib/spotify";
import { cn } from "~/lib/utils";

export function MusicTable({
  data,
  columns,
}: {
  data: Array<TrackData>;
  columns: Array<ColumnDef<TrackData>>;
}) {
  const params = useParams();
  const currentPageNumber = parseInt(params.pageNumber ?? "1");
  const tracksPerPage = 10;

  const totalPages = Math.ceil(data.length / tracksPerPage);
  const numberOfTracksToSkip = (currentPageNumber - 1) * tracksPerPage;

  if (currentPageNumber > totalPages || currentPageNumber <= 0) {
    notFound();
  }

  const currentTracks = data.slice(
    numberOfTracksToSkip,
    numberOfTracksToSkip + tracksPerPage
  );

  const table = useReactTable({
    data: currentTracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: { currentPageNumber },
  });

  return (
    <div className="scroll-m-[200px]" key={currentPageNumber}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const shouldHide = header.index === 1 || header.index === 2;
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      shouldHide && "hidden lg:table-cell",
                      header.index === 0 && "lg:w-[55%]",
                      header.index === 1 && "lg:w-[30%]",
                      header.index === 2 && "lg:w-[10%]",
                      header.index === 3 && "lg:w-[5%]"
                    )}
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
                    key={cell.id}
                    className={cn(
                      shouldHide && "hidden lg:table-cell",
                      cell.column.id === "title" && "pr-5",
                      cell.column.id === "album" && "pr-5",
                      cell.column.id === "duration" && "text-center"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mb-4 flex items-center justify-between lg:justify-end gap-8 py-4">
        <span className="text-gray-400">
          Page {currentPageNumber} of {totalPages}
        </span>
        <div className="flex items-center space-x-2">
          <StyledLink
            disabled={currentPageNumber === 1}
            href={{
              pathname: `/music`,
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
} & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "rounded border border-input bg-background p-1 text-white  no-underline transition-colors hover:bg-accent hover:text-accent-foreground hover:text-white",
        disabled && "pointer-events-none cursor-not-allowed text-gray-500"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
