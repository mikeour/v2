import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

import { CraftCardFeatured } from "~/components/crafts/craft-card";
import { getCrafts } from "~/lib/crafts";

const externalLinks = [
  {
    id: 1,
    name: "Github",
    url: "https://www.github.com/mikeour",
    Icon: Github,
  },
  {
    id: 2,
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/michaelroeslein",
    Icon: Linkedin,
  },
  {
    id: 3,
    name: "Twitter",
    url: "https://www.twitter.com/mikeour",
    Icon: Twitter,
  },
];

export default async function Home() {
  const crafts = await getCrafts();

  return (
    <main className="prose mx-auto prose-p:my-[0.8em] min-h-full w-full max-w-238 self-center py-16">
      <h1 className="mb-0 font-extrabold text-4xl text-blue-100 tracking-tighter lg:text-8xl">
        Hey, I&apos;m <br />
        <span className="bg-linear-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
          Michael Roeslein
        </span>
      </h1>

      <p>I&apos;m a design-focused web developer living in Las Vegas, NV.</p>

      <p>
        I&apos;m excited to have this little corner of the internet to talk
        about all the things I love — whether it&apos;s sharing what music{" "}
        <Link href="/music"> I&apos;m listening</Link> to, what movies{" "}
        <Link href="/movies">I&apos;m watching</Link> lately, or what I&apos;m
        writing about UI/UX:
      </p>

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

      <div className="mt-24 flex gap-4">
        {externalLinks.map((externalLink) => (
          <a
            className="flex aspect-square w-11 shrink-0 items-center justify-center rounded bg-gray-800 p-3 transition-colors hover:bg-gray-700"
            href={externalLink.url}
            key={externalLink.id}
          >
            <externalLink.Icon fill="currentColor" size={18} />
            <span className="sr-only">{externalLink.name}</span>
          </a>
        ))}
      </div>
    </main>
  );
}
