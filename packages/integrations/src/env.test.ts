import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("env.spotify", () => {
  beforeEach(() => {
    vi.stubEnv("SPOTIFY_CLIENT_ID", "test-client-id");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test-refresh-token");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns auth credentials when all env vars are set", async () => {
    const { spotify } = await import("./env");
    const auth = spotify();

    expect(auth).toEqual({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      refreshToken: "test-refresh-token",
    });
  });

  it("caches the result after first call", async () => {
    const { spotify } = await import("./env");
    const first = spotify();
    const second = spotify();

    expect(first).toBe(second);
  });

  it("throws when SPOTIFY_CLIENT_ID is missing", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test");
    const { spotify } = await import("./env");

    expect(() => spotify()).toThrow("Missing SPOTIFY_CLIENT_ID");
  });

  it("throws when SPOTIFY_CLIENT_SECRET is missing", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SPOTIFY_CLIENT_ID", "test");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "test");
    const { spotify } = await import("./env");

    expect(() => spotify()).toThrow("Missing SPOTIFY_CLIENT_SECRET");
  });

  it("throws when SPOTIFY_REFRESH_TOKEN is missing", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("SPOTIFY_CLIENT_ID", "test");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "test");
    const { spotify } = await import("./env");

    expect(() => spotify()).toThrow("Missing SPOTIFY_REFRESH_TOKEN");
  });
});

describe("env.lastfm", () => {
  beforeEach(() => {
    vi.stubEnv("LASTFM_API_KEY", "test-api-key");
    vi.stubEnv("LASTFM_USERNAME", "test-username");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns auth credentials when all env vars are set", async () => {
    const { lastfm } = await import("./env");
    const auth = lastfm();

    expect(auth).toEqual({
      apiKey: "test-api-key",
      username: "test-username",
    });
  });

  it("throws when LASTFM_API_KEY is missing", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("LASTFM_USERNAME", "test");
    const { lastfm } = await import("./env");

    expect(() => lastfm()).toThrow("Missing LASTFM_API_KEY");
  });

  it("throws when LASTFM_USERNAME is missing", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("LASTFM_API_KEY", "test");
    const { lastfm } = await import("./env");

    expect(() => lastfm()).toThrow("Missing LASTFM_USERNAME");
  });
});

describe("env.tmdb", () => {
  beforeEach(() => {
    vi.stubEnv("TMDB_API_KEY", "test-api-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns auth credentials when env var is set", async () => {
    const { tmdb } = await import("./env");
    const auth = tmdb();

    expect(auth).toEqual({
      apiKey: "test-api-key",
    });
  });

  it("throws when TMDB_API_KEY is missing", async () => {
    vi.unstubAllEnvs();
    const { tmdb } = await import("./env");

    expect(() => tmdb()).toThrow("Missing TMDB_API_KEY");
  });
});
