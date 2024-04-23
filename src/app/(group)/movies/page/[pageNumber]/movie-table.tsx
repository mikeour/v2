"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { cn } from "~/lib/utils";

import type { ColumnDef } from "@tanstack/react-table";
import type { Film } from "~/types";

const moviesPerPage = 10;

type MovieTableProps = {
  data: Array<Film>;
  columns: Array<ColumnDef<Film>>;
  currentPageNumber: number;
};

export function MovieTable({
  data,
  columns,
  currentPageNumber,
}: MovieTableProps) {
  const totalPages = Math.ceil(data.length / moviesPerPage);
  const numberOfMoviesToSkip =
    (currentPageNumber - 1) * moviesPerPage;

  const currentTracks = data.slice(
    numberOfMoviesToSkip,
    numberOfMoviesToSkip + moviesPerPage
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
    <div className="scroll-m-[200px]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const shouldHide =
                  header.index === 1 ||
                  header.index === 2 ||
                  header.index === 3;

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      shouldHide && "hidden lg:table-cell",
                      header.index === 0 && "lg:w-[45%]",
                      header.index === 1 && "lg:w-[10%]",
                      header.index === 2 && "lg:w-[15%]",
                      header.index === 3 && "text-center lg:w-[10%]",
                      header.index === 4 && "text-right lg:w-[10%]"
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
                  cell.column.id === "year" ||
                  cell.column.id === "watched" ||
                  cell.column.id === "isRewatch";

                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      shouldHide && "hidden lg:table-cell",
                      cell.column.id === "title" && "pr-5",
                      cell.column.id === "album" && "pr-5",
                      cell.column.id === "rating" &&
                        "table-cell text-right text-blue-400"
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
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
              pathname: `/movies`,
            }}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </StyledLink>
          <StyledLink
            disabled={currentPageNumber === 1}
            href={{
              pathname: `/movies/page/${currentPageNumber - 1}`,
            }}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </StyledLink>
          <StyledLink
            disabled={currentPageNumber + 1 > totalPages}
            href={{
              pathname: `/movies/page/${currentPageNumber + 1}`,
            }}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </StyledLink>
          <StyledLink
            disabled={currentPageNumber + 1 > totalPages}
            href={{
              pathname: `/movies/page/${totalPages}`,
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
        "rounded border border-input bg-background p-1 text-white  no-underline transition-colors hover:bg-accent hover:text-accent-foreground hover:text-white",
        disabled &&
          "pointer-events-none cursor-not-allowed text-gray-500"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
