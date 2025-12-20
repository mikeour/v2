import letterboxd from "letterboxd";

import { getFormattedDate } from "~/utils";
import type { Film, LetterboxdFilm } from "./types";

export async function getFilms() {
  const response: LetterboxdFilm[] = await letterboxd("mikeour");

  const diaryEntries = response.filter((film) => film.type === "diary");

  return diaryEntries.map(transformFilm);
}

function transformFilm(film: LetterboxdFilm): Film {
  return {
    id: `${film.film.title}-${film.date.watched}`,
    watched: getFormattedDate(film.date.watched),
    title: film.film.title,
    year: film.film.year,
    poster: film.film.image.large,
    rating: film.rating.text,
    review: film.review,
    url: film.uri,
    isRewatch: film.isRewatch,
  };
}
