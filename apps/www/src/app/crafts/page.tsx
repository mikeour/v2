import Link from "next/link";

import { CraftCard } from "~/components/crafts/craft-card";
import { getCraftImage, getCrafts } from "~/lib/crafts";

export default async function Page() {
  const crafts = await getCrafts();

  return (
    <div className="not-prose flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-white">Crafts</h1>
        <p>Exploring modern user interface components.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {await Promise.all(
          crafts.map(async (craft) => {
            const image = await getCraftImage(craft.slug, craft.image);
            return (
              <Link
                className="contents"
                href={`/crafts/${craft.slug}`}
                key={craft.slug}
              >
                <CraftCard image={image} title={craft.title} />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
