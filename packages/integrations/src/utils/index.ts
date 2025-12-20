export function getFormattedDate(date: number | string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  return formattedDate;
}

export { getLastFMAuth, getLetterboxdAuth, getSpotifyAuth } from "./auth";
