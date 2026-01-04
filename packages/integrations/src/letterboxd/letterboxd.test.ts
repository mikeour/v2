import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LetterboxdFilm } from "./types";

// Mock the letterboxd package
vi.mock("letterboxd", () => ({
  default: vi.fn(),
}));

// Import after mocking
import letterboxd from "letterboxd";

import { getFilms } from "./letterboxd";

const mockLetterboxd = vi.mocked(letterboxd);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getFilms", () => {
  it("returns transformed diary entries", async () => {
    const mockResponse: LetterboxdFilm[] = [
      {
        type: "diary",
        date: { watched: "2024-01-15T12:00:00.000Z" },
        film: {
          title: "Inception",
          year: "2010",
          image: { large: "https://poster.url/inception.jpg" },
        },
        rating: { text: "4.5" },
        review: "Mind-bending masterpiece",
        uri: "https://letterboxd.com/film/inception",
        isRewatch: false,
      },
      {
        type: "diary",
        date: { watched: "2024-01-10T12:00:00.000Z" },
        film: {
          title: "The Dark Knight",
          year: "2008",
          image: { large: "https://poster.url/dark-knight.jpg" },
        },
        rating: { text: "5" },
        review: "Perfect superhero film",
        uri: "https://letterboxd.com/film/dark-knight",
        isRewatch: true,
      },
    ];

    mockLetterboxd.mockResolvedValue(mockResponse);

    const result = await getFilms();

    expect(mockLetterboxd).toHaveBeenCalledWith("mikeour");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "Inception-2024-01-15T12:00:00.000Z",
      watched: "January 15, 2024",
      title: "Inception",
      year: "2010",
      poster: "https://poster.url/inception.jpg",
      rating: "4.5",
      review: "Mind-bending masterpiece",
      url: "https://letterboxd.com/film/inception",
      isRewatch: false,
    });
    expect(result[1].title).toBe("The Dark Knight");
    expect(result[1].isRewatch).toBe(true);
  });

  it("filters out non-diary entries", async () => {
    const mockResponse: LetterboxdFilm[] = [
      {
        type: "diary",
        date: { watched: "2024-01-15" },
        film: {
          title: "Diary Entry Film",
          year: "2024",
          image: { large: "https://poster.url/diary.jpg" },
        },
        rating: { text: "4" },
        review: "",
        uri: "https://letterboxd.com/film/diary",
        isRewatch: false,
      },
      {
        type: "list",
        date: { watched: "2024-01-10" },
        film: {
          title: "List Entry Film",
          year: "2024",
          image: { large: "https://poster.url/list.jpg" },
        },
        rating: { text: "3" },
        review: "",
        uri: "https://letterboxd.com/film/list",
        isRewatch: false,
      },
      {
        type: "review",
        date: { watched: "2024-01-05" },
        film: {
          title: "Review Entry Film",
          year: "2024",
          image: { large: "https://poster.url/review.jpg" },
        },
        rating: { text: "5" },
        review: "Great film",
        uri: "https://letterboxd.com/film/review",
        isRewatch: false,
      },
    ];

    mockLetterboxd.mockResolvedValue(mockResponse);

    const result = await getFilms();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Diary Entry Film");
  });

  it("handles empty response", async () => {
    mockLetterboxd.mockResolvedValue([]);

    const result = await getFilms();

    expect(result).toHaveLength(0);
  });
});
