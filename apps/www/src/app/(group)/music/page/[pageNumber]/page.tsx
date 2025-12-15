import {
  getCurrentlyPlayingTrack,
  getRecentlyPlayedTracks,
} from "~/lib/spotify";
import type { TrackData } from "~/types";
import { columns } from "./columns";
import { MusicTable } from "./music-table";

export const revalidate = 60;

export async function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((pageNumber) => ({
    pageNumber: String(pageNumber),
  }));
}

export default async function Page(props: {
  params: Promise<{ pageNumber: string }>;
}) {
  const params = await props.params;
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
      <MusicTable
        columns={columns}
        currentPageNumber={Number.parseInt(params.pageNumber ?? "1", 10)}
        data={tracks}
      />
    </div>
  );
}
