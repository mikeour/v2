import { getFilms } from "@mikeour/integrations/letterboxd";

import { columns } from "./columns";
import { MovieTable } from "./movie-table";

export const revalidate = 60;

export async function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((pageNumber) => ({
    pageNumber: String(pageNumber),
  }));
}

export default async function Page(props: {
  params: Promise<{ pageNumber: string }>;
}) {
  const params = await props.params;
  const films = await getFilms();

  return (
    <div>
      <MovieTable
        columns={columns}
        currentPageNumber={Number.parseInt(params.pageNumber ?? "1", 10)}
        data={films}
      />
    </div>
  );
}
