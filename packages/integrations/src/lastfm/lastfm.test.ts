import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "../test-setup";
import { getCurrentlyPlayingTrack, getRecentlyPlayedTracks } from "./lastfm";

beforeEach(() => {
  vi.stubEnv("LASTFM_API_KEY", "test-api-key");
  vi.stubEnv("LASTFM_USERNAME", "test-user");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getCurrentlyPlayingTrack", () => {
  it("returns track when currently playing", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("method")).toBe("user.getrecenttracks");
        expect(url.searchParams.get("user")).toBe("test-user");
        expect(url.searchParams.get("api_key")).toBe("test-api-key");
        expect(url.searchParams.get("limit")).toBe("1");

        return HttpResponse.json({
          recenttracks: {
            track: [
              {
                "@attr": { nowplaying: "true" },
                name: "Bohemian Rhapsody",
                artist: { "#text": "Queen" },
                album: { "#text": "A Night at the Opera" },
                url: "https://last.fm/track/queen/bohemian-rhapsody",
                image: [
                  { "#text": "small.jpg", size: "small" },
                  { "#text": "large.jpg", size: "large" },
                ],
              },
            ],
          },
        });
      })
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).not.toBeNull();
    expect(result?.title).toBe("Bohemian Rhapsody");
    expect(result?.artist).toBe("Queen");
    expect(result?.album).toBe("A Night at the Opera");
    expect(result?.isPlaying).toBe(true);
    expect(result?.albumImageUrl).toBe("large.jpg");
  });

  it("returns null when not currently playing", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", () => {
        return HttpResponse.json({
          recenttracks: {
            track: [
              {
                // No @attr means not currently playing
                name: "Yesterday",
                artist: { "#text": "The Beatles" },
                album: { "#text": "Help!" },
                url: "https://last.fm/track/beatles/yesterday",
                date: { uts: "1704067200", "#text": "01 Jan 2024, 00:00" },
                image: [{ "#text": "img.jpg", size: "large" }],
              },
            ],
          },
        });
      })
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).toBeNull();
  });

  it("returns null when no tracks", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", () =>
        HttpResponse.json({
          recenttracks: {
            track: [],
          },
        })
      )
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).toBeNull();
  });
});

describe("getRecentlyPlayedTracks", () => {
  it("returns transformed tracks", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("limit")).toBe("50");

        return HttpResponse.json({
          recenttracks: {
            track: [
              {
                name: "Song One",
                artist: { "#text": "Artist One" },
                album: { "#text": "Album One" },
                url: "https://last.fm/track/one",
                date: { uts: "1704067200", "#text": "01 Jan 2024, 00:00" },
                image: [{ "#text": "img1.jpg", size: "large" }],
              },
              {
                name: "Song Two",
                artist: { "#text": "Artist Two" },
                album: { "#text": "Album Two" },
                url: "https://last.fm/track/two",
                date: { uts: "1704063600", "#text": "31 Dec 2023, 23:00" },
                image: [{ "#text": "img2.jpg", size: "large" }],
              },
            ],
          },
        });
      })
    );

    const result = await getRecentlyPlayedTracks();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Song One");
    expect(result[0].artist).toBe("Artist One");
    expect(result[0].isPlaying).toBe(false);
    expect(result[1].title).toBe("Song Two");
  });

  it("filters out now-playing tracks", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", () =>
        HttpResponse.json({
          recenttracks: {
            track: [
              {
                "@attr": { nowplaying: "true" },
                name: "Now Playing Song",
                artist: { "#text": "Artist" },
                album: { "#text": "Album" },
                url: "https://last.fm/track/now",
                image: [{ "#text": "img.jpg", size: "large" }],
              },
              {
                name: "Past Song",
                artist: { "#text": "Artist" },
                album: { "#text": "Album" },
                url: "https://last.fm/track/past",
                date: { uts: "1704067200", "#text": "01 Jan 2024, 00:00" },
                image: [{ "#text": "img.jpg", size: "large" }],
              },
            ],
          },
        })
      )
    );

    const result = await getRecentlyPlayedTracks();

    // Should only include the track with a date (not the now-playing one)
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Past Song");
  });

  it("respects custom limit", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("limit")).toBe("10");

        return HttpResponse.json({
          recenttracks: { track: [] },
        });
      })
    );

    await getRecentlyPlayedTracks(10);
  });

  it("handles empty response", async () => {
    server.use(
      http.get("https://ws.audioscrobbler.com/2.0/", () =>
        HttpResponse.json({
          recenttracks: { track: [] },
        })
      )
    );

    const result = await getRecentlyPlayedTracks();

    expect(result).toHaveLength(0);
  });
});
