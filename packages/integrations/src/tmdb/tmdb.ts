import type {
  TMDBMovieDetails,
  TMDBSearchResponse,
} from "@mikeour/integrations/tmdb";

function getTMDBAuth() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set");
  }

  return { apiKey };
}

const { apiKey } = getTMDBAuth();
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function searchMovie(
  title: string,
  year?: string
): Promise<TMDBSearchResponse> {
  const params: Record<string, string> = { query: title };

  if (year) {
    params.year = year;
  }

  return fetchTMDB<TMDBSearchResponse>("/search/movie", params);
}

export function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  return fetchTMDB<TMDBMovieDetails>(`/movie/${movieId}`, {
    append_to_response: "credits",
  });
}

export async function enrichFilmWithTMDB(title: string, year: string) {
  // Search for the movie
  const searchResults = await searchMovie(title, year);

  if (!searchResults.results || searchResults.results.length === 0) {
    return null;
  }

  // Get the first result (best match)
  const movie = searchResults.results[0];

  // Fetch full details including credits
  const details = await getMovieDetails(movie.id);

  // Find director from credits
  const director = details.credits?.crew?.find(
    (person) => person.job === "Director"
  );

  return {
    tmdbId: details.id,
    backdropPath: details.backdrop_path
      ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
      : null,
    posterPath: details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : null,
    genres: details.genres?.map((g) => g.name) ?? [],
    director: director?.name ?? null,
    runtime: details.runtime ?? null,
    overview: details.overview ?? null,
  };
}
