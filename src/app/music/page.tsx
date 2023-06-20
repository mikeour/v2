import Image from "next/image";
import { TimePlayed } from "~/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import {
  getCurrentlyPlayingTrack,
  getRecentlyPlayedTracks,
} from "~/lib/spotify";
import timeAgo from "~/lib/timeago";

import type { TrackData } from "~/lib/spotify";

export const revalidate = 5;

export default async function Page() {
  const [currentlyPlayingTrack, recentlyPlayedTracks] = await Promise.all([
    getCurrentlyPlayingTrack(),
    getRecentlyPlayedTracks(),
  ]);

  // Remove currentlyPlayingTrack if null
  const tracks = [currentlyPlayingTrack, ...recentlyPlayedTracks].filter(
    (track): track is TrackData => track !== null
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-[952px] flex-col gap-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Title</TableHead>
            <TableHead className="">Album</TableHead>
            <TableHead className="">Length</TableHead>
            <TableHead className="">
              <div className="ml-auto h-4 w-4">
                <TimePlayed />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell className="flex items-center gap-8">
                <Image
                  src={track.albumImageUrl}
                  alt={`${track.artist} album art`}
                  width={48}
                  height={48}
                  className="rounded"
                />

                <div className="flex flex-col gap-[2px]">
                  <span className="text-base/[16px] text-gray-100">
                    {track.title}
                  </span>
                  <span className="text-sm/[14px] text-gray-400">
                    {track.artist}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-gray-400">{track.album}</TableCell>
              <TableCell className="text-gray-400">{track.duration}</TableCell>
              <TableCell className="text-right text-gray-400">
                {track.isPlaying ? (
                  <NowPlayingIcon />
                ) : (
                  timeAgo.format(new Date(track.playedAt), "mini")
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MusicTrack({ track }: { track: TrackData }) {
  return (
    <div className="flex items-center gap-8">
      <Image
        src={track.albumImageUrl}
        alt={`${track.artist} album art`}
        width={64}
        height={64}
        className="rounded"
      />

      <div className="flex flex-col gap-[-12px]">
        <span className="text-lg text-gray-100">{track.title}</span>
        <span className="text-base text-gray-400">{track.artist}</span>
      </div>
    </div>
  );
}

function NowPlayingIcon() {
  return (
    <div className="ml-auto grid h-4 w-4 grid-cols-3 items-end gap-[1px]">
      <div className="h-[60%] w-full animate-up-and-down bg-green-400" />
      <div className="h-[30%] w-full animate-up-and-down bg-green-400 delay-200" />
      <div className="h-[75%] w-full animate-up-and-down bg-green-400 delay-300" />
    </div>
  );
}
