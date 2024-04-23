"use client";

import Image from "next/image";
import { TimePlayed } from "~/components/icons";
import { time } from "~/lib/timeago";

import type { ColumnDef } from "@tanstack/react-table";
import type { TrackData } from "~/types";

export const columns: Array<ColumnDef<TrackData>> = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const track = row.original;

      return (
        <div className="relative flex items-center gap-5">
          <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded bg-blue-400/25">
            <Image
              src={track.albumImageUrl}
              alt={`${track.artist} album art`}
              fill
              sizes="64px"
            />
          </div>

          <div className="flex flex-col gap-[2px]">
            <span className="text-base/[16px] text-gray-100">
              {track.title}
            </span>
            <span className="text-sm/[14px] text-gray-400">
              {track.artist}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "album",
    header: "Album",
    cell: ({ row }) => {
      const track = row.original;

      return (
        <span className="hidden text-gray-400 lg:table-cell">
          {track.album}
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    size: 100,
    header: "Length",
    cell: ({ row }) => {
      const track = row.original;

      return (
        <span className="hidden text-gray-400 lg:table-cell">
          {track.duration}
        </span>
      );
    },
  },
  {
    accessorKey: "playedAt",
    header: () => (
      <div className="ml-auto h-4 w-4">
        <TimePlayed />
      </div>
    ),
    cell: ({ row }) => {
      const track = row.original;
      return (
        <div
          className="text-right text-gray-400"
          suppressHydrationWarning
        >
          {track.isPlaying ? (
            <NowPlayingIcon />
          ) : (
            time.format(new Date(track.playedAt), "mini")
          )}
        </div>
      );
    },
  },
];

function NowPlayingIcon() {
  return (
    <div className="ml-auto grid h-4 w-4 grid-cols-3 items-end gap-[1px]">
      <div className="h-[60%] w-full animate-up-and-down bg-green-400" />
      <div className="h-[30%] w-full animate-up-and-down bg-green-400 delay-200" />
      <div className="h-[75%] w-full animate-up-and-down bg-green-400 delay-300" />
    </div>
  );
}
