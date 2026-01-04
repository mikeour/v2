import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "../test-setup";
import { enrichFilmWithTMDB, getMovieDetails, searchMovie } from "./tmdb";

beforeEach(() => {
  vi.stubEnv("TMDB_API_KEY", "test-api-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("searchMovie", () => {
  it("returns search results", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("query")).toBe("Inception");
        expect(url.searchParams.get("api_key")).toBe("test-api-key");

        return HttpResponse.json({
          page: 1,
          results: [{ id: 27_205, title: "Inception" }],
          total_pages: 1,
          total_results: 1,
        });
      })
    );

    const result = await searchMovie("Inception");

    expect(result.results).toHaveLength(1);
    expect(result.results[0].title).toBe("Inception");
  });

  it("includes year parameter when provided", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("query")).toBe("Dune");
        expect(url.searchParams.get("year")).toBe("2021");

        return HttpResponse.json({
          page: 1,
          results: [{ id: 438_631, title: "Dune" }],
          total_pages: 1,
          total_results: 1,
        });
      })
    );

    const result = await searchMovie("Dune", "2021");

    expect(result.results).toHaveLength(1);
  });

  it("handles empty results", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", () =>
        HttpResponse.json({
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        })
      )
    );

    const result = await searchMovie("NonexistentMovie12345");

    expect(result.results).toHaveLength(0);
  });
});

describe("getMovieDetails", () => {
  it("returns movie details with credits", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/movie/27205", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("append_to_response")).toBe("credits");

        return HttpResponse.json({
          id: 27_205,
          title: "Inception",
          backdrop_path: "/path/to/backdrop.jpg",
          poster_path: "/path/to/poster.jpg",
          genres: [{ id: 28, name: "Action" }],
          runtime: 148,
          overview: "A thief who steals corporate secrets...",
          credits: {
            crew: [{ id: 525, name: "Christopher Nolan", job: "Director" }],
          },
        });
      })
    );

    const result = await getMovieDetails(27_205);

    expect(result.id).toBe(27_205);
    expect(result.title).toBe("Inception");
    expect(result.credits?.crew).toHaveLength(1);
  });
});

describe("enrichFilmWithTMDB", () => {
  it("returns enriched film data", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", () =>
        HttpResponse.json({
          page: 1,
          results: [{ id: 27_205, title: "Inception" }],
          total_pages: 1,
          total_results: 1,
        })
      ),
      http.get("https://api.themoviedb.org/3/movie/27205", () =>
        HttpResponse.json({
          id: 27_205,
          title: "Inception",
          backdrop_path: "/path/to/backdrop.jpg",
          poster_path: "/path/to/poster.jpg",
          genres: [
            { id: 28, name: "Action" },
            { id: 878, name: "Science Fiction" },
          ],
          runtime: 148,
          overview: "A thief who steals corporate secrets...",
          credits: {
            crew: [
              { id: 525, name: "Christopher Nolan", job: "Director" },
              { id: 999, name: "Someone Else", job: "Producer" },
            ],
          },
        })
      )
    );

    const result = await enrichFilmWithTMDB("Inception", "2010");

    expect(result).toEqual({
      tmdbId: 27_205,
      backdropPath: "https://image.tmdb.org/t/p/original/path/to/backdrop.jpg",
      posterPath: "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
      genres: ["Action", "Science Fiction"],
      director: "Christopher Nolan",
      runtime: 148,
      overview: "A thief who steals corporate secrets...",
    });
  });

  it("returns null when no search results", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", () =>
        HttpResponse.json({
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        })
      )
    );

    const result = await enrichFilmWithTMDB("NonexistentMovie12345", "2024");

    expect(result).toBeNull();
  });

  it("handles missing backdrop and poster paths", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", () =>
        HttpResponse.json({
          page: 1,
          results: [{ id: 123, title: "Test Movie" }],
          total_pages: 1,
          total_results: 1,
        })
      ),
      http.get("https://api.themoviedb.org/3/movie/123", () =>
        HttpResponse.json({
          id: 123,
          title: "Test Movie",
          backdrop_path: null,
          poster_path: null,
          genres: [],
          runtime: null,
          overview: null,
          credits: { crew: [] },
        })
      )
    );

    const result = await enrichFilmWithTMDB("Test Movie", "2024");

    expect(result).toEqual({
      tmdbId: 123,
      backdropPath: null,
      posterPath: null,
      genres: [],
      director: null,
      runtime: null,
      overview: null,
    });
  });

  it("handles missing director in credits", async () => {
    server.use(
      http.get("https://api.themoviedb.org/3/search/movie", () =>
        HttpResponse.json({
          page: 1,
          results: [{ id: 456, title: "No Director Movie" }],
          total_pages: 1,
          total_results: 1,
        })
      ),
      http.get("https://api.themoviedb.org/3/movie/456", () =>
        HttpResponse.json({
          id: 456,
          title: "No Director Movie",
          backdrop_path: "/backdrop.jpg",
          poster_path: "/poster.jpg",
          genres: [{ id: 18, name: "Drama" }],
          runtime: 120,
          overview: "A movie without a director listed.",
          credits: {
            crew: [
              { id: 111, name: "Producer Name", job: "Producer" },
              { id: 222, name: "Writer Name", job: "Writer" },
            ],
          },
        })
      )
    );

    const result = await enrichFilmWithTMDB("No Director Movie", "2024");

    expect(result?.director).toBeNull();
    expect(result?.genres).toEqual(["Drama"]);
  });
});
