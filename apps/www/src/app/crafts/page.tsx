import Link from "next/link";

import { CraftCardFeatured } from "~/components/crafts/craft-card";
import { getCrafts } from "~/lib/crafts";

export default async function Page() {
  const crafts = await getCrafts();

  return (
    <div className="not-prose flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-white">Crafts</h1>
        <p>Exploring modern user interface components.</p>
      </div>

      <div className="my-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-6 sm:mb-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {crafts.map((craft) => (
          <Link
            className="contents"
            href={`/crafts/${craft.slug}`}
            key={craft.slug}
          >
            <CraftCardFeatured
              date={craft.date}
              image={`/images/crafts/${craft.slug}.jpg`}
              title={craft.title}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
