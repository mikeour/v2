export function getFormattedDate(date: number | string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  return formattedDate;
}

export function millisToMinutesAndSeconds(millis: number): string {
  const minutes = Math.floor(millis / 60_000);
  const seconds = ((millis % 60_000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}
