"use client";

import type { Film } from "@mikeour/integrations/letterboxd";
import type { ColumnDef } from "@tanstack/react-table";
import { Check } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<Film>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const film = row.original;

      return (
        <div className="relative flex items-center gap-5">
          <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded bg-blue-400/25">
            <Image
              alt={`${film.title} movie poster`}
              fill
              sizes="80px"
              src={film.poster}
            />
          </div>

          <span className="font-medium text-gray-100 text-lg/[18px]">
            {film.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => {
      const film = row.original;

      return (
        <span className="hidden text-gray-400 lg:table-cell">{film.year}</span>
      );
    },
  },
  {
    accessorKey: "watched",
    header: "Watched",
    cell: ({ row }) => {
      const film = row.original;

      return (
        <span className="hidden text-gray-400 lg:table-cell">
          {film.watched}
        </span>
      );
    },
  },
  {
    accessorKey: "isRewatch",
    header: "Rewatch",
    cell: ({ row }) => {
      const film = row.original;

      if (film.isRewatch) {
        return (
          <Check className="mx-auto text-blue-300" height={16} width={16} />
        );
      }

      return null;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const film = row.original;

      return <>{film.rating}</>;
    },
  },
];
