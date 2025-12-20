import type {
  LastFmRecentTrack,
  LastFmRecentTracksResponse,
} from "@mikeour/integrations/lastfm";
import type { TrackData } from "@mikeour/integrations/spotify";

import { getLastFMAuth } from "~/utils";

const { apiKey, username } = getLastFMAuth();

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

async function fetchLastFm<T>(
  method: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.set("method", method);
  url.searchParams.set("user", username);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());
  return response.json() as Promise<T>;
}

export async function getCurrentlyPlayingTrack(): Promise<TrackData | null> {
  const data = await fetchLastFm<LastFmRecentTracksResponse>(
    "user.getrecenttracks",
    {
      limit: "1",
    }
  );

  const track = data.recenttracks?.track?.[0];

  if (!(track && "@attr" in track)) {
    return null;
  }

  return {
    id: Date.now(),
    artist: track.artist["#text"],
    album: track.album["#text"],
    songUrl: track.url,
    title: track.name,
    albumImageUrl:
      track.image.find((img) => img.size === "large")?.["#text"] || "",
    playedAt: Date.now(),
    isPlaying: true,
    duration: "",
  };
}

export async function getRecentlyPlayedTracks(
  limit = 50
): Promise<TrackData[]> {
  const data = await fetchLastFm<LastFmRecentTracksResponse>(
    "user.getrecenttracks",
    {
      limit: String(limit),
    }
  );

  const tracks = data.recenttracks?.track ?? [];

  return tracks
    .filter((track): track is LastFmRecentTrack => "date" in track)
    .map((track) => ({
      id: Number(track.date.uts) * 1000,
      artist: track.artist["#text"],
      album: track.album["#text"],
      songUrl: track.url,
      title: track.name,
      albumImageUrl:
        track.image.find((img) => img.size === "large")?.["#text"] || "",
      playedAt: Number(track.date.uts) * 1000,
      isPlaying: false,
      duration: "",
    }));
}
