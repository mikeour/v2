// packages/integrations/tmdb/types.ts
export type TMDBMovie = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
};

export type TMDBSearchResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export type TMDBGenre = {
  id: number;
  name: string;
};

export type TMDBCrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
};

export type TMDBCastMember = {
  id: number;
  name: string;
  character: string;
  order: number;
};

export type TMDBCredits = {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
};

export type TMDBMovieDetails = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  runtime: number | null;
  genres: TMDBGenre[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  credits?: TMDBCredits;
};

export type EnrichedFilmData = {
  tmdbId: number;
  backdropPath: string | null;
  posterPath: string | null;
  genres: string[];
  director: string | null;
  runtime: number | null;
  overview: string | null;
};
