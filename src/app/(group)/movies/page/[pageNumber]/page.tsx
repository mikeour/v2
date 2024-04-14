import { getFilms } from "~/lib/letterboxd";
import { columns } from "./columns";
import { MovieTable } from "./movie-table";

export const revalidate = 60;

export async function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((pageNumber) => ({
    pageNumber: String(pageNumber),
  }));
}

export default async function Page({
  params,
}: {
  params: { pageNumber: string };
}) {
  const films = await getFilms();

  return (
    <div>
      <MovieTable
        data={films}
        columns={columns}
        currentPageNumber={parseInt(params.pageNumber ?? "1")}
      />
    </div>
  );
}
