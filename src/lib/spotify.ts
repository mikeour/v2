import type { TrackData } from "~/types";

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString(
  "base64"
);
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=50`;

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token!,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  return response.json();
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

  const data: SpotifyApi.CurrentlyPlayingObject =
    await response.json();

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
      albumImageUrl: item.album.images[0].url,
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

  return fetch(TOP_TRACKS_ENDPOINT + `?time_range=${range}`, {
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
  const data: SpotifyApi.UsersRecentlyPlayedTracksResponse =
    await response.json();

  const items = data.items ?? [];
  const tracks = items.map((item) => {
    const { track, played_at } = item;

    const recentlyPlayedTrack: TrackData = {
      id: new Date(played_at).getTime(),
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      songUrl: track.preview_url,
      title: track.name,
      albumImageUrl: track.album.images[0].url,
      playedAt: played_at,
      isPlaying: false,
      duration: millisToMinutesAndSeconds(track.duration_ms),
    };

    return recentlyPlayedTrack;
  });

  return tracks;
}

function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
}
