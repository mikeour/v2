import Link from "next/link";
import {
  getCurrentlyPlayingTrack,
  getRecentlyPlayedTracks,
} from "~/lib/spotify";
import { columns } from "./columns";
import { MusicTable } from "./music-table";

import type { TrackData } from "~/lib/spotify";

export const revalidate = 5;

export default async function Page() {
  const [currentlyPlayingTrack, recentlyPlayedTracks] = await Promise.all([
    getCurrentlyPlayingTrack(),
    getRecentlyPlayedTracks(),
  ]);

  // Remove currentlyPlayingTrack if null
  const tracks = [currentlyPlayingTrack, ...recentlyPlayedTracks]
    .filter((track): track is TrackData => track !== null)
    .slice(0, 50);

  return (
    <div className="mx-auto flex h-full w-full max-w-[952px] flex-col gap-8">
      <Link href="/" className="self-start">
        Go Back
      </Link>

      <MusicTable columns={columns} data={tracks} />
    </div>
  );
}
