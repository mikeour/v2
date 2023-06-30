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
    <div className="flex h-full w-full flex-col gap-8">
      <MusicTable columns={columns} data={tracks} />
    </div>
  );
}
