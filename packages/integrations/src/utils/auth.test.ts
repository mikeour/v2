import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getLastFMAuth, getSpotifyAuth } from "./auth";

describe("getSpotifyAuth", () => {
  beforeEach(() => {
    vi.stubEnv("SPOTIFY_CLIENT_ID", "test-client-id");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test-refresh-token");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns auth credentials when all env vars are set", () => {
    const auth = getSpotifyAuth();

    expect(auth).toEqual({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      refreshToken: "test-refresh-token",
    });
  });

  it("throws when SPOTIFY_CLIENT_ID is missing", () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test");

    expect(() => getSpotifyAuth()).toThrow("Missing SPOTIFY_CLIENT_ID");
  });

  it("throws when SPOTIFY_CLIENT_SECRET is missing", () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SPOTIFY_CLIENT_ID", "test");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test");

    expect(() => getSpotifyAuth()).toThrow("Missing SPOTIFY_CLIENT_SECRET");
  });

  it("throws when SPOTIFY_REFRESH_TOKEN is missing", () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SPOTIFY_CLIENT_ID", "test");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test");

    expect(() => getSpotifyAuth()).toThrow("Missing SPOTIFY_REFRESH_TOKEN");
  });
});

describe("getLastFMAuth", () => {
  beforeEach(() => {
    vi.stubEnv("LASTFM_API_KEY", "test-api-key");
    vi.stubEnv("LASTFM_USERNAME", "test-username");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns auth credentials when all env vars are set", () => {
    const auth = getLastFMAuth();

    expect(auth).toEqual({
      apiKey: "test-api-key",
      username: "test-username",
    });
  });

  it("throws when LASTFM_API_KEY is missing", () => {
    vi.unstubAllEnvs();
    vi.stubEnv("LASTFM_USERNAME", "test");

    expect(() => getLastFMAuth()).toThrow("Missing LASTFM_API_KEY");
  });

  it("throws when LASTFM_USERNAME is missing", () => {
    vi.unstubAllEnvs();
    vi.stubEnv("LASTFM_API_KEY", "test");

    expect(() => getLastFMAuth()).toThrow("Missing LASTFM_USERNAME");
  });
});
