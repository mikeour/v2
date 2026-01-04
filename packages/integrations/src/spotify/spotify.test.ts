import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "../test-setup";
import { getCurrentlyPlayingTrack, getRecentlyPlayedTracks } from "./spotify";

beforeEach(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "test-client-id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test-client-secret");
  vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test-refresh-token");

  // Mock token endpoint for all tests
  server.use(
    http.post("https://accounts.spotify.com/api/token", () =>
      HttpResponse.json({ access_token: "test-access-token" })
    )
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getCurrentlyPlayingTrack", () => {
  it("returns track when currently playing", async () => {
    server.use(
      http.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        ({ request }) => {
          expect(request.headers.get("Authorization")).toBe(
            "Bearer test-access-token"
          );

          return HttpResponse.json({
            timestamp: 1_704_067_200_000,
            is_playing: true,
            item: {
              type: "track",
              name: "Bohemian Rhapsody",
              duration_ms: 354_000,
              preview_url: "https://preview.url",
              artists: [{ name: "Queen" }],
              album: {
                name: "A Night at the Opera",
                images: [{ url: "https://album.image.url" }],
              },
            },
          });
        }
      )
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).not.toBeNull();
    expect(result?.title).toBe("Bohemian Rhapsody");
    expect(result?.artist).toBe("Queen");
    expect(result?.album).toBe("A Night at the Opera");
    expect(result?.isPlaying).toBe(true);
    expect(result?.duration).toBe("5:54");
  });

  it("returns null on 204 status (nothing playing)", async () => {
    server.use(
      http.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        () => new HttpResponse(null, { status: 204 })
      )
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).toBeNull();
  });

  it("returns null when item is null", async () => {
    server.use(
      http.get("https://api.spotify.com/v1/me/player/currently-playing", () =>
        HttpResponse.json({
          timestamp: 1_704_067_200_000,
          is_playing: false,
          item: null,
        })
      )
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).toBeNull();
  });

  it("returns null for non-track items (podcasts)", async () => {
    server.use(
      http.get("https://api.spotify.com/v1/me/player/currently-playing", () =>
        HttpResponse.json({
          timestamp: 1_704_067_200_000,
          is_playing: true,
          item: {
            type: "episode",
            name: "Podcast Episode",
          },
        })
      )
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result).toBeNull();
  });

  it("handles multiple artists", async () => {
    server.use(
      http.get("https://api.spotify.com/v1/me/player/currently-playing", () =>
        HttpResponse.json({
          timestamp: 1_704_067_200_000,
          is_playing: true,
          item: {
            type: "track",
            name: "Under Pressure",
            duration_ms: 248_000,
            preview_url: null,
            artists: [{ name: "Queen" }, { name: "David Bowie" }],
            album: {
              name: "Hot Space",
              images: [{ url: "https://album.image.url" }],
            },
          },
        })
      )
    );

    const result = await getCurrentlyPlayingTrack();

    expect(result?.artist).toBe("Queen, David Bowie");
  });
});

describe("getRecentlyPlayedTracks", () => {
  it("returns transformed tracks", async () => {
    server.use(
      http.get("https://api.spotify.com/v1/me/player/recently-played", () =>
        HttpResponse.json({
          items: [
            {
              played_at: "2024-01-01T12:00:00.000Z",
              track: {
                name: "Song One",
                duration_ms: 180_000,
                preview_url: "https://preview1.url",
                artists: [{ name: "Artist One" }],
                album: {
                  name: "Album One",
                  images: [{ url: "https://img1.url" }],
                },
              },
            },
            {
              played_at: "2024-01-01T11:00:00.000Z",
              track: {
                name: "Song Two",
                duration_ms: 240_000,
                preview_url: "https://preview2.url",
                artists: [{ name: "Artist Two" }],
                album: {
                  name: "Album Two",
                  images: [{ url: "https://img2.url" }],
                },
              },
            },
          ],
        })
      )
    );

    const result = await getRecentlyPlayedTracks();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Song One");
    expect(result[0].duration).toBe("3:00");
    expect(result[0].isPlaying).toBe(false);
    expect(result[1].title).toBe("Song Two");
    expect(result[1].duration).toBe("4:00");
  });

  it("handles empty items", async () => {
    server.use(
      http.get("https://api.spotify.com/v1/me/player/recently-played", () =>
        HttpResponse.json({ items: [] })
      )
    );

    const result = await getRecentlyPlayedTracks();

    expect(result).toHaveLength(0);
  });

  it("handles missing items in response", async () => {
    server.use(
      http.get("https://api.spotify.com/v1/me/player/recently-played", () =>
        HttpResponse.json({})
      )
    );

    const result = await getRecentlyPlayedTracks();

    expect(result).toHaveLength(0);
  });
});
