import { getFilms } from "~/lib/letterboxd";
import { columns } from "./columns";
import { MovieTable } from "./movie-table";

export default async function Page() {
  const films = await getFilms();

  return (
    <div>
      <MovieTable data={films} columns={columns} />
    </div>
  );
}
