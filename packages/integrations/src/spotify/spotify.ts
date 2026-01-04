import type { TrackData } from "@mikeour/integrations/spotify";

import { getSpotifyAuth, millisToMinutesAndSeconds } from "~/utils";

function getBasicAuth(): string {
  const { clientId, clientSecret } = getSpotifyAuth();
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

function getRefreshToken(): string {
  return getSpotifyAuth().refreshToken;
}
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=50";

async function getAccessToken(): Promise<{ access_token: string }> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: getRefreshToken(),
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  return response.json() as Promise<{ access_token: string }>;
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function getCurrentlyPlayingTrack() {
  const response = await getNowPlaying();

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  const data = (await response.json()) as SpotifyApi.CurrentlyPlayingObject;

  if (data.item === null) {
    return null;
  }

  const { timestamp, item, is_playing } = data;

  if (item.type === "track") {
    const currentlyPlayingTrack: TrackData = {
      id: new Date(timestamp).getTime(),
      artist: item.artists.map((artist) => artist.name).join(", "),
      album: item.album.name,
      songUrl: item.preview_url,
      title: item.name,
      albumImageUrl: item.album.images[0]?.url ?? "",
      playedAt: timestamp,
      isPlaying: is_playing,
      duration: millisToMinutesAndSeconds(item.duration_ms),
    };

    return currentlyPlayingTrack;
  }

  return null;
}

export async function getTopTracks(range: string) {
  const { access_token } = await getAccessToken();

  return fetch(`${TOP_TRACKS_ENDPOINT}?time_range=${range}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function getRecentlyPlayed() {
  const { access_token } = await getAccessToken();

  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function getRecentlyPlayedTracks() {
  const response = await getRecentlyPlayed();
  const data =
    (await response.json()) as SpotifyApi.UsersRecentlyPlayedTracksResponse;

  const items = data.items ?? [];
  const tracks = items.map((item) => {
    const { track, played_at } = item;

    const recentlyPlayedTrack: TrackData = {
      id: new Date(played_at).getTime(),
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      songUrl: track.preview_url,
      title: track.name,
      albumImageUrl: track.album.images[0]?.url ?? "",
      playedAt: played_at,
      isPlaying: false,
      duration: millisToMinutesAndSeconds(track.duration_ms),
    };

    return recentlyPlayedTrack;
  });

  return tracks;
}
