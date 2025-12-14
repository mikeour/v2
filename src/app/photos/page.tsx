import { globby } from "globby";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const paths = await globby("**/*.JPG", {
    objectMode: true,
  });

  const photos = paths.map((path) => path.name);

  return (
    <div className="flex w-full flex-col gap-12 py-[--gutter]">
      <div className="mx-auto flex w-full flex-col gap-8">
        <Link className="self-start" href="/">
          Go Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {photos.map((photo) => (
          <div
            className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800"
            key={photo}
          >
            <Image
              alt=""
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 520px) 100vw, (max-width: 768px) 50vw, 25vw"
              src={`/images/${photo}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
