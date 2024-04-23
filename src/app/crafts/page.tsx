import Image from "next/image";
import Link from "next/link";
import img from "./scroll-shadows/scroll-shadows.jpg";

export default function Page() {
  return (
    <div className="not-prose flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Crafts</h1>
        <p className="">Exploring modern user interface components.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          className="group flex flex-col gap-3 no-underline"
          href="/crafts/scroll-shadows"
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded bg-gray-600">
            <Image src={img} alt="" className="h-full w-full object-cover" />
          </div>

          <p className="transition-colors group-hover:text-gray-200">
            Scroll Shadows
          </p>
        </Link>
      </div>
    </div>
  );
}
