import type { StaticImageData } from "next/image";
import Image from "next/image";

export type CraftCardProps = {
  title: string;
  image: string | StaticImageData;
};

export function CraftCard({ title, image }: CraftCardProps) {
  return (
    <div className="group flex flex-col gap-3">
      <div className="aspect-4/3 w-full overflow-hidden rounded bg-gray-600">
        <Image
          alt=""
          className="h-full w-full object-cover"
          height={300}
          src={image}
          width={400}
        />
      </div>
      <p className="transition-colors group-hover:text-gray-200">{title}</p>
    </div>
  );
}

export type CraftCardFeaturedProps = {
  title: string;
  date: string;
  image: string | StaticImageData;
};

export function CraftCardFeatured({
  title,
  date,
  image,
}: CraftCardFeaturedProps) {
  return (
    <div className="group flex flex-col gap-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg sm:aspect-5/3">
        <Image
          alt=""
          className="my-0 h-full w-full object-cover"
          fill
          src={image}
        />
        <div className="absolute inset-0 bg-blue-400/0 transition-colors group-hover:bg-blue-400/20" />
      </div>
      <div className="not-prose flex flex-col gap-0">
        <span className="leading-none">{date}</span>
        <p className="transition-colors group-hover:text-gray-200">{title}</p>
      </div>
    </div>
  );
}
